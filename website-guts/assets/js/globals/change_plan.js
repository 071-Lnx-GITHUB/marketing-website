w.optly.mrkt.changePlanHelper = {

  changePlan: function(args){

    /*

       Changes the user's plan.

       args.plan (string) = new plan code
       args.load (function) = when the response on the http request is received, receives the XMLHttpRequestProgressEvent as an argument
       args.abort (function) = when the request is aborted, receives the XMLHttpRequestProgressEvent as an argument
       args.error (function) = when there is an error, receives the XMLHttpRequestProgressEvent as an argument
       args.callback (function) = a callback for the load event, gets passed the load event

*/

    if(typeof args.plan === 'string' && args.plan){

      var setPlan = new XMLHttpRequest();

      setPlan.addEventListener('load', function(event){

        if(typeof args.load === 'function'){

          if(typeof args.callback === 'function'){

            args.load(event, args.callback);

          } else {

            args.load(event);

          }

        }

      }, false);

      setPlan.addEventListener('abort', function(event){

        if(typeof args.abort === 'function'){

          args.abort(event);

        }

      }, false);

      setPlan.addEventListener('error', function(event){

        if(typeof args.error === 'function'){

          args.error(event);

        }

      }, false);

      setPlan.open('post', w.apiDomain + '/pricing/change_plan', true);
      setPlan.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      setPlan.withCredentials = true;
      setPlan.send('plan_id=' + args.plan);

    }

  },
  load: function(event, callback){

    // Accepts a callback that gets run 1 second after the reporting finishes

    if(event.target.status === 200){

      d.body.classList.add('change-plan-success');

      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/event/plan/free_light'
      });
      w.analytics.page('/plan/free_light');
      w.analytics.track('change plan', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      }, {
        integrations: {
          Marketo: false
        }
      });
      w.analytics.track('/plan/free_light', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      }, {
        integrations: {
          Marketo: false
        }
      });
      var oldPlan = 'nothing';
      if(
        typeof w.optly.mrkt.user.acctData === 'object' &&
          typeof w.optly.mrkt.user.acctData.plan_id === 'string'
      ){
        oldPlan = w.optly.mrkt.user.acctData.plan_id;
      }
      w.analytics.track('plan downgraded', {
        category: 'account',
        label: oldPlan + ' to free_light'
      }, {
        integrations: {
          Marketo: false
        }
      });

      if(typeof callback === 'function'){

        setTimeout(function(){

          callback(event);

        }, 1000);

      }

  } else {

    //to do: update the ui for the error
    w.analytics.track('/pricing/change_plan', {
      category: 'api error',
      label: 'pricing change plan status not 200: ' + event.XHR.status
    }, {
      integrations: {
        Marketo: false
      }
    });

  }

  },
  showDowngradeConfirmation: function(event, callback){

    //show the downgrade confirmation modal
    w.optly.mrkt.modal.open({ modalType: 'downgrade-plan-confirm' });
    $('#downgrade-plan-confirm-cont .close-btn').click(function(){
      if(!w.optly.mrkt.automatedTest()){
        location.reload();
      }
    });

    if(typeof callback === 'function'){
      callback(event);
    }

  },
  error: function(){

    w.analytics.track('/pricing/change_plan', {
      category: 'xmlhttprequest problem',
      label: 'xmlhttprequest error'
    }, {
      integrations: {
        Marketo: false
      }
    });

  },
  abort: function(){

    w.analytics.track('/pricing/change_plan', {
      category: 'xmlhttprequest problem',
      label: 'xmlhttprequest abort'
    }, {
      integrations: {
        Marketo: false
      }
    });

  }

};
