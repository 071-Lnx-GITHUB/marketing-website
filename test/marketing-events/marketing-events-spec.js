var Nightmare = require('nightmare');
//var path = require('path');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var sxswPath = config.basePath({path: '/events/sxsw2015'});
var expect = require('chai').expect;

describe('event marketing page', function() {

  describe('the external events form', function() {
    it('submits the form and reports the values', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(sxswPath)
        .type('#events-form input[name="first_name"]', config.firstName)
        .type('#events-form input[name="last_name"]', config.lastName)
        .type('#events-form input[name="company"]', config.company)
        .type('#events-form input[name="email"]', config.email)
        .click('#events-form #ops4')
        .screenshot(config.screenshot({ imgName: 'marketing-events-form-filled' }))
        .click('#events-form button[type="submit"]')
        .wait('body.marketing-event-lead-create-success')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'marketing-event-lead-create-success'}))
        .evaluate(function() {
          return document.body.getAttribute('class') + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
            describe('marketing events form submission', function() {
              it('submits successfully', function() {
                var marketingEventLeadSuccess = /marketing\-event\-lead\-create\-success/;
                expect(marketingEventLeadSuccess.test(result)).to.equal(true);
              });
            });
            var reportingObject = JSON.parse(result.split(' @@ ')[1]);
            describe('reporting object', function() {
              it('Inbound_Lead_Form_Type__c', function() {
                expect(reportingObject.Inbound_Lead_Form_Type__c).to.equal('External Events Capture');
              });
              it('Initial_Form_Source__c', function() {
                expect(reportingObject.Initial_Form_Source__c).to.equal('External Events Capture');
              });
              it('Lead_Source_Subcategory__c', function() {
                expect(reportingObject.Lead_Source_Subcategory__c).to.equal('201503 SXSW - AustinTXUS');
              });
              it('company', function() {
                expect(reportingObject.company).to.equal('Optimizely');
              });
              it('email', function() {
                expect(reportingObject.email).to.equal('testing@optimizely.com');
              });
              it('firstName', function() {
                expect(reportingObject.firstName).to.equal('David');
              });
              it('lastName', function() {
                expect(reportingObject.lastName).to.equal('Fox test');
              });
              it('leadSource', function() {
                expect(reportingObject.leadSource).to.equal('Events');
              });
              it('otm_Medium__c', function() {
                expect(reportingObject.otm_Medium__c).to.equal('direct');
              });
              it('utm_Medium__c', function() {
                expect(reportingObject.utm_Medium__c).to.equal('direct');
              });
            });
        })
        .run(done);
    });
  });
});

