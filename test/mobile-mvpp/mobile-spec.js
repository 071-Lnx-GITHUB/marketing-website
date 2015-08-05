var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var testPath = config.basePath({
  path: '/mobile',
  queryParams: {
    otm_source: 'google',
    otm_medium: 'cpc',
    otm_campaign: 'G_WW_Search_Shiva',
    otm_content: 'mabtt',
    gclid: 'CPjX-a-Hn8QCFQckgQodcxcAfw'
  }
});
var expect = require('chai').expect;

describe('testing the signup forms on the top of the mobile mvpp page', function() {

  describe('fill out the top signup form with an incorrect password', function() {

    it('shows an error on the password field', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .type('#mobile-signup-form-top input[name="email"]', config.email)
        .type('#mobile-signup-form-top input[name="password1"]', 'bad-password')
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .click('#mobile-signup-form-top button[type="submit"]')
        .wait(500)
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .evaluate(function() {
          return document.getElementById('mobile-signup-form-top').querySelector('.password1-related').classList.contains('oform-error-show');
        }, function(passwordError) {
          expect(passwordError).to.equal(true);
        })
        .run(done);
    });
  }); //end signin test

  describe('fill out the top signup form with no info', function() {

    it('shows an error on the both fields', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .type('#mobile-signup-form-top input[name="email"]', '')
        .type('#mobile-signup-form-top input[name="password1"]', '')
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .click('#mobile-signup-form-top button[type="submit"]')
        .wait(500)
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .evaluate(function() {
          var passwordError = document.getElementById('mobile-signup-form-top').querySelector('.password1-related').classList.contains('oform-error-show');
          var emailError = document.getElementById('mobile-signup-form-top').querySelector('.email-related').classList.contains('oform-error-show');
          return passwordError && emailError;
        }, function(formErrorsShown) {
          expect(formErrorsShown).to.equal(true);
        })
        .run(done);
    });
  });

  describe('submit the form with valid info', function() {

    it('adds the form success data attribute to the body', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .type('#mobile-signup-form-top input[name="email"]', config.email)
        .type('#mobile-signup-form-top input[name="password1"]', config.password)
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .click('#mobile-signup-form-top button[type="submit"]')
        .wait(config.formSuccessElm({formAction: '/account/create'}))
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .evaluate(function() {
          return document.body.dataset.formSuccess + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {

            var reportingObject = JSON.parse(result.split(' @@ ')[1]);
            describe('check form submission', function() {
              it('valid body attribute', function() {
                expect(/^\/account\/create/.test(result)).to.equal(true);
              });
            });
            describe('check reporting object', function() {

              it('gclid', function() {
                expect(reportingObject.GCLID__c).to.equal('CPjX-a-Hn8QCFQckgQodcxcAfw');
              });
              it('email', function() {
                expect(reportingObject.email).to.equal('david_test@optimizely.com');
              });
              it('first name', function() {
                expect(reportingObject.firstName).to.equal('David');
              });
              it('last name', function() {
                expect(reportingObject.lastName).to.equal('FP ');
              });
              it('lead source', function() {
                expect(reportingObject.leadSource).to.equal('Website');
              });
              it('otm campaign', function() {
                expect(reportingObject.otm_Campaign__c).to.equal('G_WW_Search_Shiva');
              });
              it('otm content', function() {
                expect(reportingObject.otm_Content__c).to.equal('mabtt');
              });
              it('otm medium', function() {
                expect(reportingObject.otm_Medium__c).to.equal('cpc');
              });
              it('otm source', function() {
                expect(reportingObject.otm_Source__c).to.equal('google');
              });
              it('initial form source', function() {
                expect(reportingObject.Initial_Form_Source__c).to.equal('Create Account - Mobile');
              });

            });

        })
        .run(done);
    });

  });

});
