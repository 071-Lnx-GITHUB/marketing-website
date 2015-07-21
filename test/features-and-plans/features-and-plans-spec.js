var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var pricingPath = config.basePath({
  path: '/features-and-plans/',
  queryParams: {
    otm_source: 'google',
    otm_medium: 'cpc',
    otm_campaign: 'G_WW_Search_Shiva',
    otm_content: 'mabtt',
    gclid: 'CPjX-a-Hn8QCFQckgQodcxcAfw'
  }
});
var expect = require('chai').expect;

describe('pricing page', function() {

  describe('deprecated plan user', function() {
    it('downgrades to starter', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(config.basePath({
          queryParams: {
            plan: 'bronze-oneyear'
          }
        }))
        .click('#starter-cta')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'downgrade-confirm' }))
        .click('#downgrade-plan-form button[type="submit"]')
        .wait('body.downgrade-plan-success')
        .screenshot(config.screenshot({ imgName: 'downgrade-plan-success' }))
        .evaluate(function() {
          return document.body.getAttribute('class');
        }, function(result) {
            var createAccount = /downgrade\-plan\-submit/;
            var changePlan = /downgrade\-plan\-submit/;
            expect(createAccount.test(result)).to.equal(true);
            expect(changePlan.test(result)).to.equal(true);
        })
        .run(done);
    });
  }); //end create account test

  describe('enterprise user', function() {
    it('cannot downgrade', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(config.basePath({
          queryParams: {
            plan: 'enterprise-oneyear'
          }
        }))
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'enterprise-downgrade-option' }))
        .evaluate(function() {
          return document.querySelector('#starter-plan .action');
        }, function(result) {
            expect(result).to.equal('');
        })
        .run(done);
    });
  }); //end create account test

  describe('signed in user with no plan', function() {
    it('signs up for starter plan', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(config.basePath({
          queryParams: {
            plan: ''
          }
        }))
        .click('#starter-cta')
        .wait('body.change-plan-success')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'pricing-no-plan-start-new-plan' }))
        .evaluate(function() {
          return document.body.getAttribute('class');
        }, function(result) {
            var changePlan = /change\-plan\-success/;
            expect(changePlan.test(result)).to.equal(true);
        })
        .run(done);
    });

    // Counterpart test to the 'enterprise user cannot downgrade' test
    // If the user has no plan, they should be able to sign up for either plan
    it('expects the starter button to have id starter-cta', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(config.basePath({
          queryParams: {
            plan: ''
          }
        }))
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'enterprise-downgrade-option' }))
        .evaluate(function() {
          return window.jQuery('#starter-cta').attr('id');
        }, function(result) {
            expect(result).to.equal('starter-cta');
        })
        .run(done);
    });
  }); //end create account test

  describe('anonymous visitor', function() {
    it('subscribes to starter plan', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(pricingPath)
        .click('#starter-cta')
        .wait(300)
        .type('#signup-dialog input[name="email"]', config.email)
        .type('#signup-dialog input[name="password1"]', 'ks93+-93KLI')
        .type('#signup-dialog input[name="password2"]', 'ks93+-93KLI')
        .click('#signup-dialog input[name="Web_Interest__c"]')
        .click('#signup-dialog input[name="Mobile_Web_Interest__c"]')
        .click('#signup-dialog input[name="iOS_Interest__c"]')
        .click('#signup-dialog input[name="Android_Interest__c"]')
        .screenshot(config.screenshot({ imgName: 'pricing-signup-form-filled' }))
        .click('#signup-dialog button[type="submit"]')
        //.wait(3000)
        //.wait(config.formSuccessElm({formAction: '/account/create'}))
        .wait('body.create-account-success')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'pricing-signup-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class') + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
            describe('form submission', function(){
              it('create account', function(){
                expect(/create\-account\-success/.test(result)).to.equal(true);
              });
              it('change plan', function(){
                expect(/change\-plan\-success/.test(result)).to.equal(true);
              });
            });
            var reportingObject = JSON.parse(result.split(' @@ ')[1]);
            describe('reporting object', function(){
              it('gclid', function(){
                expect(reportingObject.GCLID__c).to.equal('CPjX-a-Hn8QCFQckgQodcxcAfw');
              });
              it('email', function(){
                expect(reportingObject.email).to.equal('david_test@optimizely.com');
              });
              it('first name', function(){
                expect(reportingObject.firstName).to.equal('David');
              });
              it('last name', function(){
                expect(reportingObject.lastName).to.equal('FP ');
              });
              it('lead source', function(){
                expect(reportingObject.leadSource).to.equal('Website');
              });
              it('initial form source', function(){
                expect(reportingObject.Initial_Form_Source__c).to.equal('Pricing Signup form');
              });
              it('inbound lead form source', function(){
                expect(reportingObject.Initial_Form_Source__c).to.equal('Pricing Signup form');
              });
              it('lead source subcategory', function(){
                expect(reportingObject.Lead_Source_Subcategory__c).to.equal('Optimizely');
              });
              it('otm campaign', function(){
                expect(reportingObject.otm_Campaign__c).to.equal('G_WW_Search_Shiva');
              });
              it('otm content', function(){
                expect(reportingObject.otm_Content__c).to.equal('mabtt');
              });
              it('otm medium', function(){
                expect(reportingObject.otm_Medium__c).to.equal('cpc');
              });
              it('otm source', function(){
                expect(reportingObject.otm_Source__c).to.equal('google');
              });

              it('phone', function(){
                expect(reportingObject.phone).to.equal('999999999');
              });
              it('Android', function(){
                expect(reportingObject.Android_Interest__c).to.equal('true');
              });
              it('Web', function(){
                expect(reportingObject.Web_Interest__c).to.equal('true');
              });
              it('iOS', function(){
                expect(reportingObject.iOS_Interest__c).to.equal('true');
              });
              it('Mobile web', function(){
                expect(reportingObject.Mobile_Web_Interest__c).to.equal('true');
              });
            });
        })
        .run(done);
    });
  }); //end create account test

  describe('visitor', function() {
    it('submits contact sales form from bottom button', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(pricingPath)
        .click('#enterprise-cta')
        .wait(300)
        .type('#contact-sales-form input[name="first_name"]', config.firstName)
        .type('#contact-sales-form input[name="last_name"]', config.lastName)
        .type('#contact-sales-form input[name="company"]', config.company)
        .type('#contact-sales-form input[name="title"]', config.title)
        .type('#contact-sales-form input[name="email"]', config.email)
        .type('#contact-sales-form input[name="phone_number"]', config.phone)
        .type('#contact-sales-form input[name="website"]', config.website)
        .click('#contact-sales-form input[name="Web_Interest__c"]')
        .click('#contact-sales-form input[name="Mobile_Web_Interest__c"]')
        .click('#contact-sales-form input[name="iOS_Interest__c"]')
        .click('#contact-sales-form input[name="Android_Interest__c"]')
        .screenshot(config.screenshot({ imgName: 'contact-form-filled' }))
        .click('#contact-sales-form button[type="submit"]')
        .wait('body.contact-sales-success')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'contact-sales-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class') + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
            var reportingObject = JSON.parse(result.split(' @@ ')[1]);
            describe('form works', function(){
              it('checks submit', function(){
                expect(/contact-sales-submit/.test(result)).to.equal(true);
              });
              it('checks success', function(){
                expect(/contact\-sales\-success/.test(result)).to.equal(true);
              });
            });
            describe('check reporting object', function(){
              it('inbound lead form type', function(){
                expect(reportingObject.Inbound_Lead_Form_Type__c).to.equal('Contact Sales');
              });
              it('gclid', function(){
                expect(reportingObject.GCLID__c).to.equal('CPjX-a-Hn8QCFQckgQodcxcAfw');
              });
              it('company', function(){
                expect(reportingObject.company).to.equal('Optimizely');
              });
              it('title', function(){
                expect(reportingObject.title).to.equal('Frontend engineer');
              });
              it('website', function(){
                expect(reportingObject.website).to.equal('https://www.optimizely.com');
              });
              it('email', function(){
                expect(reportingObject.email).to.equal('testing@optimizely.com');
              });
              it('first name', function(){
                expect(reportingObject.firstName).to.equal('David');
              });
              it('last name', function(){
                expect(reportingObject.lastName).to.equal('Fox test');
              });
              it('lead source', function(){
                expect(reportingObject.leadSource).to.equal('Website');
              });
              it('otm campaign', function(){
                expect(reportingObject.otm_Campaign__c).to.equal('G_WW_Search_Shiva');
              });
              it('otm content', function(){
                expect(reportingObject.otm_Content__c).to.equal('mabtt');
              });
              it('otm medium', function(){
                expect(reportingObject.otm_Medium__c).to.equal('cpc');
              });
              it('otm source', function(){
                expect(reportingObject.otm_Source__c).to.equal('google');
              });
              it('initial form source', function(){
                expect(reportingObject.Initial_Form_Source__c).to.equal('Contact Sales');
              });
              it('phone', function(){
                expect(reportingObject.phone).to.equal('5555555555');
              });
              it('Android', function(){
                expect(reportingObject.Android_Interest__c).to.equal('true');
              });
              it('Web', function(){
                expect(reportingObject.Web_Interest__c).to.equal('true');
              });
              it('iOS', function(){
                expect(reportingObject.iOS_Interest__c).to.equal('true');
              });
              it('Mobile web', function(){
                expect(reportingObject.Mobile_Web_Interest__c).to.equal('true');
              });
            });
        })
        .run(done);
    });
    it('submits contact sales form from top button', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(pricingPath)
        .click('#talk-to-us')
        .wait(300)
        .type('#contact-sales-form input[name="first_name"]', config.firstName)
        .type('#contact-sales-form input[name="last_name"]', config.lastName)
        .type('#contact-sales-form input[name="company"]', config.company)
        .type('#contact-sales-form input[name="title"]', config.title)
        .type('#contact-sales-form input[name="email"]', config.email)
        .type('#contact-sales-form input[name="phone_number"]', config.phone)
        .type('#contact-sales-form input[name="website"]', config.website)
        .click('#contact-sales-form input[name="Web_Interest__c"]')
        .click('#contact-sales-form input[name="Mobile_Web_Interest__c"]')
        .click('#contact-sales-form input[name="iOS_Interest__c"]')
        .click('#contact-sales-form input[name="Android_Interest__c"]')
        .screenshot(config.screenshot({ imgName: 'contact-form-filled' }))
        .click('#contact-sales-form button[type="submit"]')
        .wait('body.contact-sales-success')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'contact-sales-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class') + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
            var reportingObject = JSON.parse(result.split(' @@ ')[1]);
            describe('form works', function(){
              it('checks submit', function(){
                expect(/contact-sales-submit/.test(result)).to.equal(true);
              });
              it('checks success', function(){
                expect(/contact\-sales\-success/.test(result)).to.equal(true);
              });
            });
            describe('check reporting object', function(){
              it('inbound lead form type', function(){
                expect(reportingObject.Inbound_Lead_Form_Type__c).to.equal('Contact Sales');
              });
              it('gclid', function(){
                expect(reportingObject.GCLID__c).to.equal('CPjX-a-Hn8QCFQckgQodcxcAfw');
              });
              it('company', function(){
                expect(reportingObject.company).to.equal('Optimizely');
              });
              it('title', function(){
                expect(reportingObject.title).to.equal('Frontend engineer');
              });
              it('website', function(){
                expect(reportingObject.website).to.equal('https://www.optimizely.com');
              });
              it('email', function(){
                expect(reportingObject.email).to.equal('testing@optimizely.com');
              });
              it('first name', function(){
                expect(reportingObject.firstName).to.equal('David');
              });
              it('last name', function(){
                expect(reportingObject.lastName).to.equal('Fox test');
              });
              it('lead source', function(){
                expect(reportingObject.leadSource).to.equal('Website');
              });
              it('otm campaign', function(){
                expect(reportingObject.otm_Campaign__c).to.equal('G_WW_Search_Shiva');
              });
              it('otm content', function(){
                expect(reportingObject.otm_Content__c).to.equal('mabtt');
              });
              it('otm medium', function(){
                expect(reportingObject.otm_Medium__c).to.equal('cpc');
              });
              it('otm source', function(){
                expect(reportingObject.otm_Source__c).to.equal('google');
              });
              it('initial form source', function(){
                expect(reportingObject.Initial_Form_Source__c).to.equal('Contact Sales');
              });
              it('phone', function(){
                expect(reportingObject.phone).to.equal('5555555555');
              });
              it('Android', function(){
                expect(reportingObject.Android_Interest__c).to.equal('true');
              });
              it('Web', function(){
                expect(reportingObject.Web_Interest__c).to.equal('true');
              });
              it('iOS', function(){
                expect(reportingObject.iOS_Interest__c).to.equal('true');
              });
              it('Mobile web', function(){
                expect(reportingObject.Mobile_Web_Interest__c).to.equal('true');
              });
            });
        })
        .run(done);
    });
  }); //end create account test

});
