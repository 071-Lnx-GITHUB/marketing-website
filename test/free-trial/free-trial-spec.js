var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var freeTrialPath = config.basePath({
  path: '/free-trial',
  queryParams: {
    otm_source: 'google',
    otm_medium: 'cpc',
    otm_campaign: 'G_WW_Search_Shiva',
    otm_content: 'mabtt',
    gclid: 'CPjX-a-Hn8QCFQckgQodcxcAfw'
  }
});
var expect = require('chai').expect;

describe('testing form on the free trial page', function() {

  describe('submit the form with an invalid email', function() {
    it('the email input will show an error', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(freeTrialPath)
        .type('#seo-form input[name="url-input"]', 'http://google.com')
        .type('#seo-form input[name="name"]', 'DFP')
        .type('#seo-form input[name="email"]', 'this-email-wont-work')
        .screenshot(config.screenshot({ imgName: 'free-trial-email-error-form-filled' }))
        .click('#seo-form button[type="submit"]')
        .wait(1000)
        .screenshot(config.screenshot({ imgName: 'free-trial-email-error' }))
        .exists('#email.oform-error-show', function(emailErrorExists) {
          expect(emailErrorExists).to.equal(true);
        }).run(done);
    });
  });

  describe('submit the form without a phone number', function() {
    it('should be successful and redirect to the /edit path', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 100)
        .goto(freeTrialPath)
        // TODO: causing phantom security warning
        //.inject('js', path.join(process.cwd(), '/', 'test/', 'phantomGlobal.js'))
        .type('#seo-form input[name="url-input"]', 'http://google.com')
        .type('#seo-form input[name="name"]', 'DFP')
        .type('#seo-form input[name="email"]', config.email)
        .screenshot(config.screenshot({ imgName: 'free-trial-success-form-filled' }))
        .click('#seo-form button[type="submit"]')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'free-trial-success-processing' }))
        .wait(config.formSuccessElm({formAction: '/account/free_trial_create'}))
        .evaluate(function() {
          return document.body.dataset.formSuccess + ' @@ ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
            var reportingObject = JSON.parse(result.split(' @@ ')[1]);
            describe('successful submission', function() {
              expect(/^\/account\/free_trial_create/.test(result)).to.equal(true);
            });
            describe('', function() {
              it('inbound lead form type', function() {
                expect(reportingObject.Inbound_Lead_Form_Type__c).to.equal('Free Trial Signup Form');
              });
              it('gclid', function() {
                expect(reportingObject.GCLID__c).to.equal('CPjX-a-Hn8QCFQckgQodcxcAfw');
              });
              it('email', function() {
                expect(reportingObject.email).to.equal('david+test2015117154242@optimizely.com');
              });
              it('first name', function() {
                expect(reportingObject.firstName).to.equal('david');
              });
              it('last name', function() {
                expect(reportingObject.lastName).to.equal('fox-powell test');
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
                expect(reportingObject.Initial_Form_Source__c).to.equal('Free Trial PPC');
              });
              it('phone', function() {
                expect(reportingObject.phone).to.equal('9172315327');
              });
            });
        })
        .run(done);
    });
  });

  describe('submit the form with no info', function() {
    it('shows an error class on the body', function(done) {
      new Nightmare({phantomPath: phantomPath})
      .viewport(1024, 1000)
      .goto(freeTrialPath)
      .evaluate(function() {
        //return document.body.classList.contains('oform-error');
        var inputs = document.getElementById('seo-form').querySelectorAll('input');
        inputs = Array.prototype.slice.call(inputs).filter(function(input) {
          return input.type !== 'hidden';
        });
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].value = '';
        }
        return inputs.length;
      }, function(inputsLength) {
        expect(inputsLength).to.equal(4);
      })
      .click('#seo-form #submit')
      .wait('body.oform-error')
      .screenshot(config.screenshot({ imgName: 'free-trial-error-no-form-info' }))
      .evaluate(function() {
        return document.body.classList.contains('oform-error');
      }, function(bodyClassError) {
        expect(bodyClassError).to.equal(true);
      })
      .run(done);
    });
  });

});
