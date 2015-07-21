var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var assemble = require('assemble');
var cheerio = require('cheerio');
var matter = require('gray-matter');
var config = require('./config');

describe('translate the assemble views to translate modals and partials', function() {
  var locale = 'de';
  var readPath = path.join(__dirname, '/fixture/website-guts/templates');
  var instance = null;
  var translated = {};
  var modalA = fs.readFileSync(path.join(readPath, 'components/modals/modal-a.hbs'), {encoding: 'utf8'});
  var modalData = matter(modalA);
  var partialA = fs.readFileSync(path.join(readPath, 'partials/partial-a.hbs'), {encoding: 'utf8'});
  var partialData = matter(partialA);
  var views = null;

  modalData.contents = new Buffer(modalData.content.replace(/\n/g, ''));
  partialData.contents = new Buffer(partialData.content.replace(/\n/g, ''));

  before(function() {
    instance = assemble.init();
    instance.data(config);
    var removeTranslationKeys = require('../utils/remove-translation-keys')(instance);
    var createDictionary = require('../utils/create-dictionary.js')(instance);
    var modalDict = createDictionary(modalData);
    var partialDict = createDictionary(partialData);
    instance.views = {};
    instance.views.modals = {
      'modal-a': {
        content: modalDict.HTML_page_content,
        data: modalData.data
      }
    };
    instance.views.partials = {
      'partial-a': {
        content: partialDict.HTML_page_content,
        data: partialData.data
      }
    };

    instance.views.modals[locale + '_' + 'modal-a'] = _.cloneDeep(instance.views.modals['modal-a']);
    instance.views.partials[locale + '_' + 'partial-a'] = _.cloneDeep(instance.views.partials['partial-a']);
    removeTranslationKeys(instance.views);

    var lang = {
      'de_DE': {
        '/website-guts/templates/components/modals/modal-a': modalDict,
        '/website-guts/templates/partials/partial-a': partialDict
      }
    };

    function mockTranslation(str) {
      return '~' + str + '~';
    }

    translated.de_DE = Object.keys(lang.de_DE).reduce(function(o, fp) {
      o[fp] = {};
      _.forEach(lang.de_DE[fp], function(str, key) {
        var $, text;
        if(key === 'HTML_page_content') {
          $ = cheerio.load(str);
          text = $('h1').text();
          $('h1').text(mockTranslation(text));
          o[fp][key] = $.html();
        } else {
          o[fp][key] = mockTranslation(str);
        }
      });
      return o;
    }, {});

    removeTranslationKeys(translated);

    var translateAssembleViews = require('../plugins/translation-utils/translate-assemble-views')(instance);
    views = translateAssembleViews(translated);
  });

  describe('translateAssembleViews()', function() {

    it('translates views with a `locale` prefix', function() {
      var localePartial = views.partials['de_partial-a'];
      var partialContent = localePartial.content;
      var $partialContent = cheerio.load(partialContent);

      expect($partialContent('h1').text()).to.equal('~partial-a page content~');

      var localeModal = views.modals['de_modal-a'];
      var modalContent = localeModal.content;
      var $modalContent = cheerio.load(modalContent);
      var modalData = localeModal.data;

      expect($modalContent('h1').text()).to.equal('~modal-a page content~');
      expect(modalData.modal_title).to.equal('~modal-a title~');
    });

    it('doesn\'t translate views without a locale prefix', function() {
      var localePartial = views.partials['partial-a'];
      var partialContent = localePartial.content;
      var $partialContent = cheerio.load(partialContent);

      expect($partialContent('h1').text()).to.equal('partial-a page content');

      var localeModal = views.modals['modal-a'];
      var modalContent = localeModal.content;
      var $modalContent = cheerio.load(modalContent);
      var modalData = localeModal.data;

      expect($modalContent('h1').text()).to.equal('modal-a page content');
      expect(modalData.modal_title).to.equal('modal-a title');

    });

  });

});

