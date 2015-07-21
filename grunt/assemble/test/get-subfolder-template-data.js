var expect = require('chai').expect;
var assemble = require('assemble');
var config = require('./config');

describe('translate and merge file data', function() {
  var instance = null;
  var subfolderTemplateData;

  before(function() {
    instance = assemble.init();
    instance.data(config);

    subfolderTemplateData = require('../plugins/translation-utils/get-subfolder-template-data')(instance);
  });

  describe('getSubfolderTemplateData()', function() {

    it('returns an object with `hasOwnTemplate` data', function() {
      expect(subfolderTemplateData.hasOwnTemplate).to.include('/subfolders/de/c/index');
    });

    it('returns an object with `hasNoTemplate` data', function() {
      expect(subfolderTemplateData.hasNoTemplate).to.include('/subfolders/de/d/index');
    });

  });

});

