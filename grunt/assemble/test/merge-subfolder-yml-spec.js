var expect = require('chai').expect;
var path = require('path');
var assemble = require('assemble');
var config = require('./config');

describe('translate and merge file data', function() {
  var instance = null;
  var locale = 'de';
  var merged;

  before(function() {
    var patterns = ['**/*.yml'];
    var rootPath = path.join(__dirname, 'fixture', config.websiteRoot);
    var subfolderPath = path.join(__dirname, 'fixture', config.subfoldersRoot, locale);
    instance = assemble.init();
    instance.data(config);

    var readYmlData = require('../transforms/translation-helpers/yml-file-data')(instance);
    var rootData = readYmlData(patterns, rootPath);
    var subfolderData = readYmlData(patterns, subfolderPath);
    var createDictionary = require('../utils/create-dictionary')(instance);
    var rootDict = createDictionary(rootData);
    var subfolderDict = createDictionary(subfolderData, locale);

    var lang = {};

    lang[config.websiteRoot] = rootDict;
    lang[locale] = subfolderDict;

    var pageDataClone = {};

    pageDataClone[config.websiteRoot] = rootData;
    pageDataClone[locale] = subfolderData;

    instance.set('lang', lang);
    var mergeSubfolderYml = require('../plugins/translation-utils/merge-subfolder-yml')(instance);
    merged = mergeSubfolderYml(lang, pageDataClone);
  });

  describe('mergeSubfolderYml()', function() {

    it('merges subfolder data with parent website data if no .hbs file exists in subfolder directory', function() {
      expect(merged[locale]['/subfolders/de/d/index'].page_data).to.have.all.keys('TR_website_d', 'd', 'TR_subfolder_d', 'd_1', 'TR_subfolder_d_1');
    });

    it('does not merge subfolder data with parent website if no .hbs file exists in subfolder directory', function() {
      expect(merged[locale]['/subfolders/de/c/index'].page_data).to.have.all.keys('TR_subfolder_c', 'c');
    });

  });

});

