var Nightmare = require('nightmare');
//var path = require('path');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var homepagePath = config.basePath({path: '/'});
var expect = require('chai').expect;

describe('test homepage', function() {

  describe('user submits test-it-out form', function() {
    it('creates an account', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(homepagePath)
        .wait(300)
        .type('form#get-started #email-input', config.email)
        .click('form#get-started button[type="submit"]')
        .wait('body.test-it-out-success')
        .screenshot(config.screenshot({ imgName: 'homepage-test-it-out-submit' }))
        .type('#signup-dialog input[name="password1"]', config.password)
        .type('#signup-dialog input[name="password2"]', config.password)
        .click('#signup-dialog input[name="Web_Interest__c"]')
        .click('#signup-dialog input[name="Mobile_Web_Interest__c"]')
        .click('#signup-dialog input[name="iOS_Interest__c"]')
        .click('#signup-dialog input[name="Android_Interest__c"]')
        .screenshot(config.screenshot({ imgName: 'homepage-anonymous-wall-filled-in' }))
        .click('#signup-dialog button[type="submit"]')
        .wait('body.create-account-success')
        .screenshot(config.screenshot({ imgName: 'homepage-anonymous-wall-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class') + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
            describe('verified that', function() {
              var reportingObject = JSON.parse(result.split(' @@ ')[1]);
              it('visitor was signed in', function() {
                expect(/signed\-in/.test(result)).to.equal(true);
              });
              it('form submission worked', function() {
                expect(/test\-it\-out\-success/.test(result)).to.equal(true);
              });
              it('android checkbox is in reporting object', function() {
                expect(reportingObject.Android_Interest__c).to.equal('true');
              });
              it('iOS checkbox is in reporting object', function() {
                expect(reportingObject.iOS_Interest__c).to.equal('true');
              });
              it('mobile web checkbox is in reporting object', function() {
                expect(reportingObject.Mobile_Web_Interest__c).to.equal('true');
              });
              it('web checkbox is in reporting object', function() {
                expect(reportingObject.Web_Interest__c).to.equal('true');
              });
              it('lead source is in reporting object', function() {
                expect(reportingObject.leadSource).to.equal('Website');
              });
              it('initial form source is in reporting object', function() {
                expect(reportingObject.Initial_Form_Source__c).to.equal('Test It Out Homepage');
              });
              it('inbound lead form type is in reporting object', function() {
                expect(reportingObject.Inbound_Lead_Form_Type__c).to.equal('Home Page Signup form');
              });
              it('lead source subcategory is in reporting object', function() {
                expect(reportingObject.Lead_Source_Subcategory__c).to.equal('Optimizely');
              });
              it('utm medium is in reporting object', function() {
                expect(reportingObject.utm_Medium__c).to.equal('direct');
              });
              it('otm medium is in reporting object', function() {
                expect(reportingObject.otm_Medium__c).to.equal('direct');
              });
              it('email is in reporting object', function() {
                expect(reportingObject.email).to.equal('david_test@optimizely.com');
              });
              it('first name is in reporting object', function() {
                expect(reportingObject.firstName).to.equal('David');
              });
              it('last name is in reporting object', function() {
                expect(reportingObject.lastName).to.equal('FP ');
              });
              it('phone is in reporting object', function() {
                expect(reportingObject.phone).to.equal('999999999');
              });
            });
        })
        .run(done);
    });
  }); //end create account test

});
