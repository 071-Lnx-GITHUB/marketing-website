var expect = require('chai').expect;
var path = require('path');
var _ = require('lodash');
var assemble = require('assemble');
var config = require('./config');

describe('translate and merge file data', function() {
  var instance = null;
  var locale = 'de';
  var translatePageData, translated;

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

    var lang = {
      modals: {
        '/modals/path': {
          TR_modal_data: 'modal data'
        }
      },
      partials: {
        '/partials/path': {
          TR_partial_data: 'partial data',
          HTML_page_content: 'partial content'
        }
      },
      layouts: {
        '/layouts/path/a': {
          TR_layout_data_a: 'layout data `a`'
        },
        '/layouts/path/b': {
          TR_layout_data_b: 'layout data `b`'
        }
      },
    };

    lang[config.websiteRoot] = rootDict;
    lang[locale] = subfolderDict;

    var pageDataClone = {
      de: {
        '/modals/path': {
          TR_modal_data: 'modal data',
          modalData: 'modal data'
        },
        '/partials/path': {
          TR_partial_data: 'partial data',
          HTML_page_content: 'partial content',
          partialData: 'partial data'
        },
      },
      layouts: {
        '/layouts/path/a': {
          TR_layout_data_a: 'layout data `a`',
          layoutData: 'layout data `a`'
        },
        '/layouts/path/b': {
          TR_layout_data_b: 'layout data `b`',
          layoutData: 'layout data `b`'
        }
      }
    };

    pageDataClone[config.websiteRoot] = rootData;
    _.forEach(subfolderData, function(fileData, fp) {
      fileData.layouts = _.cloneDeep(pageDataClone.layouts);
    });
    pageDataClone[locale] = _.merge(pageDataClone[locale], subfolderData);

    var translations = {
      de_DE: {
        'website c data': '~website c data~',
        'website d data': '~website d data~',
        'subfolder c data': '~subfolder c data~',
        'subfolder d data': '~subfolder d data~',
        'subfolder d_1 data': '~subfolder d_1 data~',
        'modal data': '~modal data~',
        'partial data': '~partial data~',
        'partial content': '~partial content~',
        'layout data `a`': '~layout data `a`~',
        'layout data `b`': '~layout data `b`~'
      }
    };

    instance.set('lang', lang);
    translatePageData = require('../plugins/translation-utils/translate-page-data')(instance);

    translated = translatePageData(locale, pageDataClone, translations);
  });

  describe('translatePageData()', function() {

    it('translates subfolder data', function() {
      expect(translated[locale]['/subfolders/de/c/index']).to.have.deep.property('page_data.TR_subfolder_c', '~subfolder c data~');
      expect(translated[locale]['/subfolders/de/d/index']).to.have.deep.property('page_data.TR_subfolder_d', '~subfolder d data~');
    });

    it('translates and merges subfolder data with parent website data if no .hbs file exists in subfolder directory', function() {
      expect(translated[locale]['/subfolders/de/d/index']).to.have.deep.property('page_data.TR_website_d', '~website d data~');
    });

    it('translates and does not merge subfolder data with parent website if no .hbs file exists in subfolder directory', function() {
      expect(translated[locale]['/subfolders/de/c/index'].page_data).to.have.all.keys('TR_subfolder_c', 'c');
    });

    it('returns an object with keys not flagged for translation merged onto the context', function() {
      expect(translated[locale]['/subfolders/de/c/index']).to.have.deep.property('page_data.c', 'c');
      expect(translated[locale]['/subfolders/de/d/index']).to.have.deep.property('page_data.d', 'd');
    });

    it('translates special types (layouts|modals|partials)', function() {
      expect(translated[locale]).to.have.deep.property('/modals/path.TR_modal_data', '~modal data~');
      expect(translated[locale]).to.have.deep.property('/partials/path.TR_partial_data', '~partial data~');
      expect(translated[locale]).to.have.deep.property('/partials/path.HTML_page_content', '~partial content~');
    });

    it('doesn\'t translate keys not flagged for translation with the same value as translation keys', function() {
      expect(translated[locale]).to.have.deep.property('/modals/path.modalData', 'modal data');
      expect(translated[locale]).to.have.deep.property('/partials/path.partialData', 'partial data');
    });

    it('translated layouts attached to the subfolder data context', function() {
      expect(translated[locale]['/subfolders/de/c/index'].layouts).to.have.deep.property('/layouts/path/a.TR_layout_data_a', '~layout data `a`~');
      expect(translated[locale]['/subfolders/de/c/index'].layouts).to.have.deep.property('/layouts/path/b.TR_layout_data_b', '~layout data `b`~');
    });

    it('doesn\'t translate layout data not flagged for translation', function() {
      expect(translated[locale]['/subfolders/de/c/index'].layouts).to.have.deep.property('/layouts/path/a.layoutData', 'layout data `a`');
      expect(translated[locale]['/subfolders/de/c/index'].layouts).to.have.deep.property('/layouts/path/b.layoutData', 'layout data `b`');
    });
  });

});

