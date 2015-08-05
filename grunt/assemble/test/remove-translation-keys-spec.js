var expect = require('chai').expect;
var assemble = require('assemble');
var cheerio = require('cheerio');
var config = require('./config');
var cheerio = require('cheerio');

describe('function for removing translation keys from file data objects', function() {
  var instance = null;
  var removeTranslationKeys;

  before(function() {
    instance = assemble.init();
    instance.data(config);
    removeTranslationKeys = require('../utils/remove-translation-keys')(instance);
  });

  describe('removeTranslationKeys()', function() {
    describe('removing TR keys', function() {
      var ogObj = {
        TR_a: 'a',
        TR_nested_a: {
          TR_a: 'a',
          b: 'b'
        },
        nested_b: {
          TR_a: 'a',
          b: 'b'
        }
      };
      var returnedObj;
      before(function() {
        returnedObj = removeTranslationKeys(ogObj);
      });

      it('removes top level TR keys', function() {
        expect(returnedObj.a).to.be.ok;
        expect(returnedObj.nested_a).to.be.ok;
      });

      it('removes nested TR keys', function() {
        expect(returnedObj.nested_a.a).to.be.ok;
        expect(returnedObj.nested_a.TR_a).to.be.undefined;
      });

      it('removes nested TR keys even if top level key is not flagged', function() {
        expect(returnedObj.nested_b.a).to.be.ok;
        expect(returnedObj.nested_b.TR_a).to.be.undefined;
      });

      it('mutates the original object', function() {
        expect(ogObj.a).to.be.ok;
        expect(ogObj.nested_a).to.be.ok;
        expect(ogObj.nested_a.a).to.be.ok;
        expect(ogObj.nested_a.TR_a).to.be.undefined;
        expect(ogObj.nested_b.a).to.be.ok;
        expect(ogObj.nested_b.TR_a).to.be.undefined;
      });
    });

    //all MD keys are transformed to HTML keys in createTranslationDictionary
    describe('removing HTML keys', function() {
      var returnedObj;
      var ogObj = {
        HTML_page_content: '<h1>HTML page <a href="/dist/partners">content</a></h1>',
        HTML_nested_a: {
          HTML_a: 'a',
          b: 'b'
        },
        nested_b: {
          HTML_a: 'a',
          b: 'b'
        }
      };
      before(function() {
        returnedObj = removeTranslationKeys(ogObj);
      });

      it('removes top level HTML keys', function() {
        expect(returnedObj.page_content).to.be.ok;
        expect(returnedObj.nested_a).to.be.ok;
      });

      it('removes nested HTML keys', function() {
        expect(returnedObj.nested_a.a).to.be.ok;
        expect(returnedObj.nested_a.HTML_a).to.be.undefined;
      });

      it('removes nested HTML keys even if top level key is not flagged', function() {
        expect(returnedObj.nested_b.a).to.be.ok;
        expect(returnedObj.nested_b.TR_a).to.be.undefined;
      });

      it('mutates the original object', function() {
        expect(ogObj.page_content).to.be.ok;
        expect(ogObj.nested_a).to.be.ok;
        expect(ogObj.nested_a.a).to.be.ok;
        expect(ogObj.nested_a.HTML_a).to.be.undefined;
        expect(ogObj.nested_b.a).to.be.ok;
        expect(ogObj.nested_b.TR_a).to.be.undefined;
      });
    });

    describe('it takes an optional locale argument to prepend in filepaths (with /dist/ linkPath) for HTML keys', function() {
      var locale = 'de';
      var returnedObj;
      var ogObj = {
        HTML_page_content: '<h1>HTML page <a href="/dist/partners">content</a></h1>',
        HTML_nested_a: {
          HTML_a: '<h1>HTML page <a href="/dist/de/in">content</a></h1>',
        },
        HTML_nested_b: {
          HTML_a: '<h1>HTML page <a href="/dist/decrime">content</a></h1>',
        }
      };
      before(function() {
        returnedObj = removeTranslationKeys(ogObj, locale);
      });

      it('adds the locale into the <a> tag `href` for a path without the locale', function() {
        var $ = cheerio.load(returnedObj.page_content);
        expect($('a').attr('href')).to.equal('/dist/de/partners');
      });

      it('adds the locale into the <a> tag `href` for a path without the locale but starting with same letters as locale', function() {
        var $ = cheerio.load(returnedObj.nested_b.a);
        expect($('a').attr('href')).to.equal('/dist/de/decrime');
      });

      it('does not add the locale into the <a> tag `href` for a path with the locale', function() {
        var $ = cheerio.load(returnedObj.nested_a.a);
        expect($('a').attr('href')).to.equal('/dist/de/in');
      });
    });

    describe('removing TR_ and HTML_ keys in an array', function() {
      var returnedObj;
      var ogObj = {
        TR_a: [{TR_a: 'a'}],
        nested_a: {
          TR_a: [{TR_b: 'b'}]
        },
        b: [{TR_b: 'b'}]
      };
      before(function() {
        returnedObj = removeTranslationKeys(ogObj);
      });

      it('removes TR keys from objects in arrays if parent key is TR', function() {
        expect(returnedObj.a).to.be.ok;
        expect(returnedObj.a[0].a).to.equal('a');
      });

      it('removes TR keys from objects in arrays if parent key is TR and array is nested', function() {
        expect(returnedObj.nested_a.a).to.be.ok;
        expect(returnedObj.nested_a.a[0].b).to.equal('b');
      });

      it('it does not remove TR key from object in array if parent key is not TR', function() {
        expect(returnedObj.b[0].b).to.be.undefined;
        expect(returnedObj.b[0].TR_b).to.be.ok;
      });
    });

    describe('removing TR_ and HTML_ keys for JS type values other than strings', function() {
      var returnedObj;
      var ogObj = {
        TR_a: 1,
        nested_a: {
          TR_a: undefined,
          TR_b: null
        }
      };
      before(function() {
        returnedObj = removeTranslationKeys(ogObj);
      });

      it('removes TR keys for null & undefined values', function() {
        expect(returnedObj.a).to.be.ok;
        expect(returnedObj.a).to.equal(1);
      });

      it('removes TR keys for integer values', function() {
        expect(returnedObj.nested_a.a).to.be.undefined;
        expect(returnedObj.nested_a.b).to.equal(null);
        expect(returnedObj.nested_a).to.have.all.keys('a', 'b');
      });
    });

    describe('an object with key with the same name as a TR|MD key', function() {
      var returnedObj;
      var ogObj = {
        TR_a: 'translated',
        a: 'not translated'
      };
      before(function() {
        returnedObj = removeTranslationKeys(ogObj);
      });

      it('it overwrites TR|MDvalues with keys of the same name without TR|MD', function() {
        expect(returnedObj.a).to.equal('not translated');
        expect(returnedObj.TR_a).to.be.undefined;
      });
    });
  });
});
