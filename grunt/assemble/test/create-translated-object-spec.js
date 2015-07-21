var expect = require('chai').expect;
var path = require('path');
var assemble = require('assemble');
var config = require('./config');

describe('adds all pre-translated data to an object', function() {
  var instance = null;
  var locales = {
    de: 'de_DE',
    fr: 'fr_FR',
    chde: 'de_DE',
  };
  var createTranslatedObject;
  var pageDataClone = {};

  config.locales = locales;

  before(function() {
    var patterns = ['**/*.yml'];
    var rootPath = path.join(__dirname, 'fixture', config.websiteRoot);
    var subfoldersPath = path.join(__dirname, 'fixture', config.subfoldersRoot);
    instance = assemble.init();
    instance.data(config);

    var readYmlData = require('../transforms/translation-helpers/yml-file-data')(instance);
    var rootData = readYmlData(patterns, rootPath);

    pageDataClone[config.websiteRoot] = rootData;
    Object.keys(locales).forEach(function(locale) {
      var localePath = path.join(subfoldersPath, locale);
      var data = readYmlData(patterns, localePath);
      pageDataClone[locale] = data;
    });

    createTranslatedObject = require('../plugins/translation-utils/create-translated-object')(instance);
  });

  describe('createTranslatedObject()', function() {

    it('merges subfolder data with the same language key into an object', function() {
      var translatedObj = createTranslatedObject('de_DE', pageDataClone);
      expect(translatedObj).to.have.all.keys('/subfolders/de/c/index', '/subfolders/de/c/index', '/subfolders/chde/index');
      expect(translatedObj).to.deep.equal({
        '/subfolders/de/c/index': {
          page_data: {
            c: 'c',
            TR_subfolder_c: 'subfolder c data'
          }
        },
        '/subfolders/de/d/index': {
          page_data: {
            d: 'd',
            TR_subfolder_d: 'subfolder d data',
            d_1: 'd_1',
            TR_subfolder_d_1: 'subfolder d_1 data'
          }
        },
        '/subfolders/chde/index': {
          page_data: {
            chde: 'chde no translate',
            TR_chde: 'chde translate'
          }
        }
      });
    });

    it('works for local key that is only associate with one locale', function() {
      var translatedObj = createTranslatedObject('fr_FR', pageDataClone);
      expect(translatedObj).to.have.all.keys('/subfolders/fr/index');
      expect(translatedObj).to.deep.equal({
        '/subfolders/fr/index': {
          page_data: {
            fr: 'fr no translate',
            TR_fr: 'fr translate'
          }
        }
      });
    });

  });

});

