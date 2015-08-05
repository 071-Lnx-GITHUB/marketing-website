var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var testPath = config.basePath({path: '/'});
var expect = require('chai').expect;

describe('check that custom dimension gets set correctly', function() {

  describe('checks custom dimension value pre and post sign-in', function() {

    it('signs the user in', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .click('[data-modal-click="signin"]')
        .wait(300)
        .type('#signin-dialog input[name="email"]', config.email)
        .type('#signin-dialog input[name="password"]', config.password)
        .screenshot(config.screenshot({ imgName: 'signin-form-filled' }))
        .evaluate(function() {
          window.firstPlanType = document.body.getAttribute('data-plan');
        })
        .click('#signin-dialog button[type="submit"]')
        .wait(500)
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .wait('body.signed-in')
        .evaluate(function() {
          return {
            initialPlanType: window.firstPlanType,
            currentPlanType: window.$('body').attr('data-plan'),
            signedIn: window.optly.signedIn
          };
        }, function(result) {
          expect(result.initialPlanType).to.equal('none');
          expect(result.currentPlanType).to.equal('free');
          expect(result.signedIn).to.equal(true);
        })
        .run(done);
    });

  }); //end signin test

});
