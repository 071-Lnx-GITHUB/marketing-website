// Listen for the 'get started' button press
$('#get-started').submit(function(e){
  e.preventDefault();

  var inputVal = $('#get-started input[type="email"]').val();

  if( inputVal ){
    w.optly.mrkt.modal.open({
      modalType: 'signup',
      callback: function(){
        w.optimizely.push(['activate', 2548130011]);
      }
    });
    d.body.classList.add('test-it-out-success');
    $('input[type="email"]').val(inputVal);
    $('#signup-form input[name="Initial_Form_Source__c"]').val('Test It Out Homepage');
    $('#signup-form input[name="Inbound_Lead_Form_Type__c"]').val('Home Page Signup form');
  } else {
    $('input[type="email"]').focus();
  }
});

//deal with placeholder icons
window.optly.mrkt.anim.placeholderIcons({inputs: $('#get-started input')});

//track focus on form field
$('#get-started input:not([type="hidden"]), #signup-form input:not([type="hidden"])').each(function(){
  $(this).one('focus', function(){
    //put all the information in the event because we'll want to use this as a goal in optimizely
    w.analytics.track($(this).closest('form').attr('id') + ' ' + $(this).attr('name') + ' focus',
    {
      category: 'forms'
    },
    {
      integrations: {
        'Marketo': false
      }
    });
  });
});

//track blur on form field
$('#get-started input:not([type="hidden"]), #signup-form input:not([type="hidden"])').each(function(){
  $(this).one('blur', function(){
    //put all the information in the event because we'll want to use this as a goal in optimizely
    w.analytics.track($(this).closest('form').attr('id') + ' ' + $(this).attr('name') + ' blur',
    {
      category: 'forms'
    },
    {
      integrations: {
        'Marketo': false
      }
    });
  });
});

//track change on form fields
$('#get-started input:not([type="hidden"]), #signup-form input:not([type="hidden"])').each(function(){
  var element = this;
  var continuallyCheckForValue = setInterval(function(){
    if($(element).val()){
      clearInterval(continuallyCheckForValue);
      w.analytics.track($(element).closest('form').attr('id') + ' ' + $(element).attr('name') + ' value changed', {
        category: 'forms'
      },{
        integrations: {
          'Marketo': false
        }
      });
      w.analytics.track($(element).closest('form').attr('id') + ' value engagement', {
        category: 'forms'
      },{
          integrations: {
            'Marketo': false
          }
      });
    }
  }, 1000);
});

//TODO(peng-wen): Temporarily allowing signing up developer accounts here.
//Move this to developers site once fixing the HTTPS issue
var modal = w.optly.mrkt.utils.getURLParameter('modal');
if (modal === 'devsignup') {
  w.optly.mrkt.modal.open({ modalType: modal });
}
