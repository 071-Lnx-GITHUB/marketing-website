var expect = require('chai').expect;
var assemble = require('assemble');
var config = require('./config');

describe('add merge file data objects from websiteRoot to subfolders object', function() {
  var instance = null;
  var populateSubfolderData;

  before(function() {
    instance = assemble.init();
    instance.data(config);
    populateSubfolderData = require('../plugins/translation-utils/populate-subfolder-data')(instance);
  });

  describe('populateSubfolderData()', function() {
    var locale = 'de';
    var pageDataClone;
    var data;

    describe('a `de` subfolder exists with a custom path', function() {
      before(function() {
        pageDataClone = {
          website: {
            '/website/dirname/a': {a: 'a'},
            '/website/dirname/b': {b: 'b'},
          },
          modals: {
            '/modal/path': {modalData: 'modalData'}
          },
          partials: {
            '/partial/path': {partialData: 'partialData'}
          },
          layouts: {
            '/layout/path': {layoutData: 'layoutData'}
          },
          de: {
            '/subfolders/de/dirname/a': {a: 'a'},
            '/subfolders/de/dirname/custom': {custom: 'custom'},
          }
        };

        data = populateSubfolderData(locale, pageDataClone);
      });

      it('adds a key/value for the missing `b` path into the subfolder object', function() {
        var expectedKeys = [
          '/subfolders/de/dirname/a',
          '/subfolders/de/dirname/b',
          '/subfolders/de/dirname/custom'
        ];
        expect(data[locale]).to.include.keys(expectedKeys);
        expect(data[locale][expectedKeys[1]].b).to.equal('b');
      });

      it('adds a key/value for the custom types (partials|modals|layouts)', function() {
        expect(data[locale]).to.have.deep.property('/modal/path.modalData', 'modalData');
        expect(data[locale]).to.have.deep.property('/partial/path.partialData', 'partialData');
        expect(data[locale]).to.have.deep.property('/layout/path.layoutData', 'layoutData');
      });

      it('mutates the object passed to it', function() {
        var expectedKeys = [
          '/subfolders/de/dirname/a',
          '/subfolders/de/dirname/b',
          '/subfolders/de/dirname/custom'
        ];
        expect(pageDataClone[locale]).to.include.keys(expectedKeys);
        expect(pageDataClone[locale][expectedKeys[1]].b).to.equal('b');
      });
    });

    describe('no subfolder content exists', function() {
      before(function() {
        pageDataClone = {
          website: {
            '/website/dirname/a': {a: 'a'},
            '/website/dirname/b': {b: 'b'},
          }
        };

        data = populateSubfolderData(locale, pageDataClone);
      });

      it('adds all websiteRoot data to the subfolder object', function() {
        var expectedKeys = [
          '/subfolders/de/dirname/a',
          '/subfolders/de/dirname/b'
        ];
        expect(pageDataClone[locale]).to.have.all.keys(expectedKeys);
      });
    });

  });

});

