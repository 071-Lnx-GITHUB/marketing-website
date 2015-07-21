var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var expect = require('chai').expect;

describe('testing the create account dialog for US and foreign sites', function() {

  describe('filling out the create account form for the US site', function() {
    var testPath = config.basePath({path: '/'});

    it('has a reporting object key Original_Locale__c with `us` value', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .click('[data-modal-click="signup"]')
        .wait(300)
        .type('#signup-dialog input[name="email"]', config.email)
        .type('#signup-dialog input[name="password1"]', config.password)
        .type('#signup-dialog input[name="password2"]', config.password)
        .click('#signup-dialog button[type="submit"]')
        .screenshot(config.screenshot({ imgName: 'signup-form-us-filled' }))
        .wait('body.signed-in')
        .screenshot(config.screenshot({ imgName: 'signup-us-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class') + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
          var reportingObject = JSON.parse(result.split(' @@ ')[1]);
          expect(reportingObject.Original_Locale__c).to.equal('us');
        })
        .run(done);
    });
  });

  describe('filling out the create account form for the DE site', function() {
    var l10nTestPath = config.basePath({path: '/de/'});

    it('has a reporting object key Original_Locale__c with `us` value', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(l10nTestPath)
        .click('[data-modal-click="signup"]')
        .wait(300)
        .type('#signup-dialog input[name="email"]', config.email)
        .type('#signup-dialog input[name="password1"]', config.password)
        .type('#signup-dialog input[name="password2"]', config.password)
        .click('#signup-dialog button[type="submit"]')
        .screenshot(config.screenshot({ imgName: 'signup-form-de-filled' }))
        .wait('body.signed-in')
        .screenshot(config.screenshot({ imgName: 'signup-de-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class') + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
          var reportingObject = JSON.parse(result.split(' @@ ')[1]);
          expect(reportingObject.Original_Locale__c).to.equal('de');
        })
        .run(done);
    });
  });

});

