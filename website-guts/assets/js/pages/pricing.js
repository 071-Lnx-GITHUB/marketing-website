//for scroll tracking
w.optimizelyScrollTrackerID = '/plans';

$('#talk-to-us').on('click', function(e){
  w.optly.mrkt.modal.open({ modalType: 'contact-sales' });
  e.preventDefault();
});

$('.js-enterprise-plan-cta').on('click', function(e){
  w.optly.mrkt.modal.open({ modalType: 'contact-sales' });
  e.preventDefault();
});

$('#explore-features').on('click', w.optly.mrkt.utils.smoothScroll);

//setup DOM for automated test
var automatedTest = window.optly.mrkt.automatedTest();

if(automatedTest){
  w.optly.mrkt.user.acctData = {
    plan_id: w.optly.mrkt.utils.getURLParameter('plan')
  };
}

var updatePlanInfo = function(){

  var startsWithC = /^c/;

  //remove starter signup if enterprise
  if (typeof w.optly.mrkt.user.acctData === 'object') {
    if(w.optly.mrkt.user.acctData.plan_id) {
      var enterpriseRegex = /^enterprise|c/;
      if (enterpriseRegex.test(w.optly.mrkt.user.acctData.plan_id)) {
        d.body.classList.add('plan-enterprise');
      } else {
        d.body.classList.add('plan-' + w.optly.mrkt.user.acctData.plan_id);
      }
    }
    if(
      w.optly.mrkt.user.acctData.plan_id === 'enterprise-monthly' ||
      w.optly.mrkt.user.acctData.plan_id === 'enterprise-oneyear' ||
      w.optly.mrkt.user.acctData.plan_id === 'enterprise-twoyear' ||
      startsWithC.test(w.optly.mrkt.user.acctData.plan_id)
    ) {
      $('.js-starter-plan-cta').remove();
    }
  }

  $('.js-starter-plan-cta').on('click', function(e){
    $('#signup-form input[name="Initial_Form_Source__c"]').val('Pricing Signup form');
    $('#signup-form input[name="Inbound_Lead_Form_Type__c"]').val('Pricing Signup form');
    if(typeof w.optly.mrkt.user.acctData === 'object'){

      //user is signed in
      if(w.optly.mrkt.user.acctData.plan_id){

        //user already has a plan
        var plan = w.optly.mrkt.user.acctData.plan_id,
        deprecatedPlans = ['bronze-monthly', 'bronze-oneyear', 'bronze-twoyear', 'silver-monthly', 'silver-oneyear', 'silver-twoyear', 'gold-monthly', 'gold-oneyear', 'gold-twoyear'],
        isDeprecatedPlan = function(plan){
          var i, isDeprecated;
          for(i = 0; i < deprecatedPlans.length; i++){
            if(deprecatedPlans[i] === plan){
              isDeprecated = true;
            }
          }
          return isDeprecated;
        };

        if (isDeprecatedPlan(plan)) {
          //show downgrade dialog
          w.optly.mrkt.modal.open({ modalType: 'downgrade-plan' });
        } else if(
          plan !== 'enterprise-monthly' ||
          plan !== 'enterprise-oneyear' ||
          plan !== 'enterprise-twoyear'
        ) {

          //the user can signup for starter plan
          //change the plan
          w.optly.mrkt.changePlanHelper.changePlan({
            plan: 'free_light',
            callback: function(){
              //show confirmation
              w.optly.mrkt.modal.open({ modalType: 'pricing-plan-signup-thank-you' });
            },
            load: w.optly.mrkt.changePlanHelper.load
          });
        }
      } else {
        //user is signed in, but no plan
        //sign the user up for the starter plan

        //prevents user from creating multiple accounts while waiting for ajax call to return, greys out button:
        $('.js-starter-plan-cta').off('click').addClass('disabled');
        var redirectPath = w.apiDomain + '/welcome';
        if (w.optly.mrkt.utils.getURLParameter('source') === 'mobile_editor') {
          var continueTo = w.optly.mrkt.utils.getURLParameter('continue_to');
          if (continueTo) {
            redirectPath = w.apiDomain + continueTo;
          }
        }
        w.optly.mrkt.changePlanHelper.changePlan({
          plan: 'free_light',
          callback: function(){
              //show confirmation
              //w.optly.mrkt.modal.open({ modalType: 'pricing-plan-signup-thank-you' });
              if(!automatedTest){
                w.location = redirectPath;
              }
          },
          load: w.optly.mrkt.changePlanHelper.load
        });
      }
    } else {
      //user is not signed in
      w.optly.mrkt.modal.open({ modalType: 'signup' });
      $('#signup-form input[name="Initial_Form_Source__c"]').val('Pricing Signup form');
      $('#signup-form input[name="Inbound_Lead_Form_Type__c"]').val('Pricing Signup form');
    }

    e.preventDefault();
  });
};
//updatePlanInfo();

w.optly_q.push([updatePlanInfo, 'acctData']);
w.optly.mrkt.activeModals['signup-form'].remove();
var signupHelper = w.optly.mrkt.form.createAccount({formId: 'signup-form', dialogId: 'signup-dialog'});
w.optly.mrkt.activeModals = w.optly.mrkt.activeModals || {};

var signupForm  = new Oform({
  selector: '#signup-form',
  customValidation: {
    password1: function(elm) {
      return signupHelper.password1Validate(elm);
    },
    password2: function(elm) {
      return signupHelper.password2Validate(elm);
    }
  },
  middleware: w.optly.mrkt.Oform.defaultMiddleware
});

signupForm.on('before', function() {
  //set the hidden input value
  signupHelper.formElm.querySelector('[name="hidden"]').value = 'touched';
  signupHelper.processingAdd();
  signupHelper.removeErrors();
  if(signupHelper.characterMessageElm.classList.contains('oform-error-show')) {
    signupHelper.characterMessageElm.classList.remove('oform-error-show');
  }
  return true;
});

signupForm.on('validationerror', function(elm) {
  w.optly.mrkt.Oform.validationError(elm);
  signupHelper.showOptionsError({error: 'DEFAULT'});
  if(!signupHelper.characterMessageElm.classList.contains('oform-error-show')) {
    signupHelper.characterMessageElm.classList.add('oform-error-show');
  }
});

signupForm.on('error', function() {
  signupHelper.processingRemove({callee: 'error'});
  signupHelper.showOptionsError({error: 'UNEXPECTED'});
  window.analytics.track('create account xhr error', {
    category: 'account',
    label: w.location.pathname
  }, {
    integrations: {
      'Marketo': false
    }
  });
}.bind(signupHelper));

signupForm.on('load', function(event) {
  signupHelper.pricingSignupSuccess(event);
}.bind(signupHelper));

signupForm.on('done', function() {
  window.setTimeout(function() {
    signupHelper.scrollTopDialog();
  }, 500);
  signupHelper.processingRemove({callee: 'done'});

}.bind(signupHelper));

/* downgrade plan */
$('#downgrade-plan-form').submit(function(e) {
  d.body.classList.add('downgrade-plan-submit');
  w.optly.mrkt.changePlanHelper.changePlan({
    plan: 'free_light',
    load: function(){
      d.body.classList.add('downgrade-plan-success');
      //show the downgrade confirmation modal
      w.optly.mrkt.modal.open({ modalType: 'downgrade-plan-confirm' });
      //downgrade-plan
      $('#downgrade-plan-confirm-form').submit(function(){
        if(!automatedTest){
          location.reload();
        }
      });
    },
    error: w.optly.mrkt.changePlanHelper.error,
    abort: w.optly.mrkt.changePlanHelper.abort
  });
  e.preventDefault();
});

//check for url parameter to make the contact sales modal open on page load.
var modal = w.optly.mrkt.utils.getURLParameter('modal');
if (modal === 'contact-sales') {
  w.optly.mrkt.modal.open({ modalType: modal, track: false });
}
