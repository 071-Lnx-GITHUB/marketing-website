var expect = require('chai').expect;
var assemble = require('assemble');
var cheerio = require('cheerio');

describe('create dictionary from all translation keys', function() {
  var instance = null;
  var createDictionary;
  var config = {
    locales: {
    'de': 'de_DE',
    'fr': 'fr_FR',
    'es': 'es_ES',
    'jp': 'ja_JP'
    },
    linkPath: '/dist'
  };

  before(function() {
    instance = assemble.init();
    instance.data(config);
    createDictionary = require('../utils/create-dictionary')(instance);
  });

  describe('createDictionary()', function() {
    var file, locale = 'de';

    describe('accept an `undefined` argument', function() {
      var lang;

      before(function() {
        lang = createDictionary(undefined, locale);
      });

      it('should return an empty object', function() {
        expect(typeof lang).to.equal('object');
      });
    });

    describe('parse `TR_` keys', function() {
      var lang;

      before(function() {
        file = {};
        file.TR_title = 'Hello world';
        file.dont_translate = 'don\'t translate';
        file.nested_obj = {TR_nested: 'translate', nested: 'no translate'};
        file.TR_arr = ['translate me', {a: 'don\'t translate me', TR_b: 'translate me'}];
        file.arr = ['won\'t be translated', {a: 'won\'t be translated', TR_b: 'won\'t be translated'}];
        lang = createDictionary(file, locale);
      });

      it('should return an object with only TR keys or nested obj with TR keys', function() {
        expect(lang).to.have.all.keys('TR_title', 'nested_obj', 'TR_arr');
        expect(lang.nested_obj).to.have.all.keys('TR_nested');
        expect(lang.nested_obj.nested).to.be.undefined;
      });

      it('should not translate array without top level TR key', function() {
        expect(lang.arr).to.be.undefined;
      });

      it('should translate array with top level TR key', function() {
        expect(lang.TR_arr.indexOf('translate me') !== -1).to.be.true;
        expect(lang.TR_arr[1]).to.have.all.keys('TR_b');
        expect(lang.TR_arr[1].a).to.be.undefined;
      });
    });

    describe('it should parse markdown `MD_` keys to HTML', function() {
      var $, lang;
      before(function() {
        file = {};
        file.MD_link = '[AB testing tool](/resources/ab-testing-tool/ "A/B testing tool")';
        file.MD_cta = '## Already loved by these<br><strong>awesome apps</strong>';
        lang = createDictionary(file, locale);
        $ = cheerio.load(lang.HTML_link + lang.HTML_cta);
      });

      it('should return an object with only HTML keys and HTML content', function() {
        expect(lang).to.have.all.keys('HTML_link', 'HTML_cta');
      });

      it('should have a locale specific link path and a <a> title', function() {
        expect(/dist\/de\//.test($('a').attr('href'))).to.be.true;
        expect($('a').attr('title')).to.equal('A/B testing tool');
      });
    });

    describe('it should parse markdown `MD_page_content: true` keys to HTML', function() {
      var $, lang;
      before(function() {
        file = {};
        file.data = { MD_page_content: true };
        file.contents = new Buffer('# Markdown page content');
        lang = createDictionary(file, locale);
        $ = cheerio.load(lang.HTML_page_content);
      });

      it('should return an object with only HTML_page_content key', function() {
        expect(lang).to.have.all.keys('HTML_page_content');
        expect($('h1').text()).to.equal('Markdown page content');
        expect($('h1').attr('id')).to.equal('markdown-page-content');
      });
    });

    describe('it should parse `HTML_page_content: true`', function() {
      var $, lang;
      before(function() {
        file = {};
        file.data = { HTML_page_content: true };
        file.contents = new Buffer('<h1>HTML page content</h1>');
        lang = createDictionary(file, locale);
        $ = cheerio.load(lang.HTML_page_content);
      });

      it('should return an object with only HTML_page_content', function() {
        expect(lang).to.have.all.keys('HTML_page_content');
        expect($('h1').text()).to.equal('HTML page content');
      });
    });
  });
});
