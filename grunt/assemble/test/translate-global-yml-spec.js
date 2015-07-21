var expect = require('chai').expect;
var assemble = require('assemble');
var cheerio = require('cheerio');
var config = require('./config');

describe('adding all global yml to a translated object', function() {
  var instance = null;
  var locales = {
    de: 'de_DE',
    fr: 'fr_FR',
    chde: 'de_DE',
  };
  var translations = {
    'de_DE': {
      'translate a data': '~translate a data~',
      'translate b data': '~translate b data~',
      'translate c data': '~translate c data~',
      'translate d data': '~translate d data~',
      'Some Link': '~Some Link~'
    },
    'fr_FR': {
      'translate a data': '@translate a data@',
      'translate b data': '@translate b data@',
      'translate c data': '@translate c data@',
      'translate d data': '@translate d data@',
      'Some Link': '@Some Link@'
    }
  };

  config.locales = locales;
  var translateGlobalYml, globalYml;

  before(function() {
    var getGlobalYml = require('../plugins/translation-utils/get-global-yml');
    instance = assemble.init();
    var loadGlobalData = require('../utils/load-global-data')(instance);
    loadGlobalData(config);
    var globalData = instance.get('data');
    globalYml = getGlobalYml(globalData);
    translateGlobalYml = require('../plugins/translation-utils/translate-global-yml')(instance);

  });

  describe('translateGlobalYml()', function() {

    it('it translates global yml and scopes it under multiple locales associated with the same langKey', function() {
      var translated = translateGlobalYml('de_DE', globalYml, translations);
      expect(translated).to.have.all.keys('de', 'chde');
      expect(translated.de.global_a.global_a).to.equal('~translate a data~');
      expect(translated.chde.global_a.global_a).to.equal('~translate a data~');
    });

    it('it translates global yml and scopes it under a single locale that does not share a langKey', function() {
      var translated = translateGlobalYml('fr_FR', globalYml, translations);
      expect(translated).to.have.all.keys('fr');
      expect(translated.fr.global_a.global_a).to.equal('@translate a data@');
    });

    it('it translates HTML text and appends locales to `href`\'s appropriately', function() {
      var translated = translateGlobalYml('fr_FR', globalYml, translations);
      var $ = cheerio.load(translated.fr.global_a.content);
      expect($('a').attr('href')).to.equal('/dist/fr/something');
      expect($('a').text()).to.equal('@Some Link@');
    });

  });

});

