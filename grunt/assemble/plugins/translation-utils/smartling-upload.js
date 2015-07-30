var path = require('path');
var fs = require('fs');
var Q = require('q');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var jsParser = require('l10n-tools/js-parser');
var hbsParser = require('l10n-tools/hbs-parser');
var smartling = require('l10n-tools/smartling');
var glob = require('glob');
var mkdirp = require('mkdirp');
var generateKey = require('../../utils/generate-key');

module.exports = function(assemble) {
  var options = assemble.get('config.options');
  var websiteGuts = options.websiteGuts;
  var env = options.environment;
  var smartlingConfigFile = options.smartlingConfigs[options.environment];
  console.log('CURRENT SMARTLING CONFIG => %s', smartlingConfigFile);
  var smartlingConfig;
  var createDirs = [
    'tmp/upload',
    'tmp/download',
    'dist/assets/js'
  ];
  var translations = {};
  var locales = options.locales;
  var localeCodes = Object.keys(locales).map(function(subfolder) {
    return locales[subfolder];
  });

  function extractFrom(srcs, parser){
    return glob.sync(srcs).map(function (fname) {
      var phrases = parser.extract(fs.readFileSync(fname));
      return {
        fname: generateKey(fname),
        phrases: phrases
      };
    });
  }

  function catalogChanged(content, fname){
    if(!fs.existsSync(fname)) {
      return true;
    }
    // extract list of keys (basically all the messages), sort them alphabetically and join together
    var keys = Object.keys(smartling.parsePO(content)).sort().join('');
    var latestKeys = Object.keys(smartling.parsePO(fs.readFileSync(fname, {encoding: 'UTF8'}))).sort().join('');
    return keys !== latestKeys;
  }

  try {
    smartlingConfig = fs.readFileSync(path.join(process.cwd(), 'configs/secret', smartlingConfigFile), {encoding: 'utf8'});
  }
  catch(err) {
    console.error('Cannot read Smartling config: ', err);
    if (env !== 'production') {
      console.error('reading default smartlingConfig.json');
      smartlingConfig = fs.readFileSync(path.join(process.cwd(), 'configs/secret/smartlingConfig.json'), {encoding: 'utf8'});
    }
  }

  if (smartlingConfig) {
    smartlingConfig = JSON.parse(smartlingConfig);
  }

  if (process.env.SL_PREFIX) {
    smartlingConfig.PREFIX = process.env.SL_PREFIX;
  }

  var yamlDictFname = smartlingConfig.PREFIX + '_yaml.pot';
  var jsDictFname = smartlingConfig.PREFIX + '_js.pot';

  return function() {
    var lang = assemble.get('lang');
    var yamlDefer = Q.defer();
    var jsDefer = Q.defer();
    var phrases = [];

    _.forEach(lang, function(pages){
      _.forEach(pages, function(fileInfo, fname){
        var list = objParser.extract(fileInfo);
        phrases.push({fname: fname, phrases: list});
      });
    });

    createDirs.forEach(function(dir) {
      if(!fs.existsSync(dir)) {
        mkdirp.sync(dir);
      }
    });

    var content = smartling.generatePO(phrases);

    if(catalogChanged(content, 'tmp/upload/' + yamlDictFname)){
      fs.writeFile('tmp/upload/' + yamlDictFname, content);
      smartling.send(content, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, yamlDictFname, smartlingConfig.AUTO_APPROVE).then(function(){
        var defers = localeCodes.map(function(localeCode){
          return smartling.receive(localeCode, yamlDictFname, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, smartlingConfig.PSUEDO).then(function(body){
            fs.writeFile('tmp/download/' + localeCode + '-' + yamlDictFname, body);
            translations[localeCode] = smartling.parsePO2dict(body);
          });
        });

        // when all translations are fetched - call callback
        Q.all(defers).then(function(){
          yamlDefer.resolve(translations);
        });
      });
    } else {
      console.log('Server catalog didn\'t change since last upload - using cached dictionaries.');
      localeCodes.map(function(code){
        var body = fs.readFileSync('tmp/download/' + code + '-' + yamlDictFname, {encoding: 'UTF8'});
        translations[code] = smartling.parsePO2dict(body);
      });
      yamlDefer.resolve(translations);
    }

    var clientHbsPhrases = extractFrom(path.join(websiteGuts, 'templates/client/**/*.hbs'), hbsParser);
    var jsPhrases = extractFrom('website-guts/assets/js/**/*.js', jsParser).concat(clientHbsPhrases);
    content = smartling.generatePO(jsPhrases);
    var deployJSDict = function deployJSDict(locale, body) {
      var dict = smartling.parsePO2dict(body);
      content = 'window.optlyDict = ' + JSON.stringify(dict);
      var outputFname = './dist/assets/js/dict.' + locale + '.js';
      fs.writeFileSync(outputFname, content);
    };

    if(catalogChanged(content, 'tmp/upload/' + jsDictFname)){
      fs.writeFile('tmp/upload/' + jsDictFname, content);
      smartling.send(content, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, jsDictFname, smartlingConfig.AUTO_APPROVE).then(function(){
        var defers = localeCodes.map(function(localeCode){
          return smartling.receive(localeCode, jsDictFname, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID).then(function(body){
            fs.writeFile('tmp/download/' + localeCode + '-' + jsDictFname, body);
            deployJSDict(localeCode, body);
          });
        });

        // when all translations are fetched - call callback
        Q.all(defers).then(function(){
          jsDefer.resolve();
        });
      });
    } else {
      console.log('JS catalog didn\'t change since last upload - using cached dictionaries for JS.');
      localeCodes.map(function(code){
        var body = fs.readFileSync('tmp/download/' + code + '-' + jsDictFname, {encoding: 'UTF8'});
        deployJSDict(code, body);
      });
      jsDefer.resolve();
    }

    return Q.all([yamlDefer.promise, jsDefer.promise]);
  };
};
