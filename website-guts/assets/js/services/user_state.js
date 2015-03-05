window.optly                = window.optly || {};
window.optly.mrkt           = window.optly.mrkt || {};
window.optly.mrkt.services  = window.optly.mrkt.services || {};
window.optly.mrkt.user      = window.optly.mrkt.user || {};
window.optly.mrkt.errorQ    = window.optly.mrkt.errorQ || [];

window.optly.mrkt.Optly_Q = function(acctData, expData){
  var objectCreateSupported = typeof Object.create === 'function';

  window.optly.PRELOAD = window.optly.PRELOAD || {token: null};

  if(!objectCreateSupported) {
    var ThrowAway = function (a, e) {
      this.acctData = a;
      this.expData = e;
    };

    ThrowAway.prototype = window.optly.mrkt.Optly_Q.prototype;

    if(arguments.length > 0) {
      window.optly.mrkt.user.acctData = acctData;
      window.optly.mrkt.user.expData = expData;
      return new ThrowAway(acctData, expData);
    } else{
      return new ThrowAway();
    }
  }

  if(arguments.length > 0 ){
    //window.optly.PRELOAD.token = acctData.csrf_token;

    return Object.create(window.optly.mrkt.Optly_Q.prototype, {
      acctData: {
        value: window.optly.mrkt.user.acctData = acctData,
      },
      expData: {
        value: window.optly.mrkt.user.expData = expData
      }
    });
  } else {
    var acctCache, expCache;

    return Object.create(window.optly.mrkt.Optly_Q.prototype, {
      acctData: {
        get: function(){return acctCache;},
        set: function(val){
          if(!acctCache){
            //window.optly.PRELOAD.token = val.csrf_token;
            window.optly.mrkt.user.acctData = val;
            acctCache = val;
          }
        }
      },
      expData: {
        get: function(){return expCache;},
        set: function(val){
          if(!expCache){
            window.optly.mrkt.user.expData = val;
            expCache = val;
          }
        }
      }
    });
  }
};

window.optly.mrkt.Optly_Q.prototype = {

  transformQueuedArgs: function(queuedArgs) {
    var funcArgs = [];
    $.each(queuedArgs, function(index, arg) {
      if (this[ arg ] !== undefined && typeof arg !== 'object') {
        funcArgs.push(this[ arg ]);
      } else if(typeof arg === 'object') {
        funcArgs.push(arg);
      }
    }.bind(this));

    return funcArgs;
  },

  parseQ: function(fnQ) {
    var queuedArgs,
      transformedArgs,
      queuedFn = fnQ[0];

    queuedArgs = fnQ.slice(1);

    //if there are no arguments call the function with the object scope
    if(queuedArgs.length === 0) {
      queuedFn.call(this);
    } else {
      transformedArgs = this.transformQueuedArgs(queuedArgs);
      queuedFn.apply( queuedFn, transformedArgs );
    }

  },

  push: function(fnQ) {

    switch(typeof fnQ[0]) {
      case 'function':
        this.parseQ(fnQ);
      break;

      case 'string':
        fnQ[0] = this.fnCache[ fnQ[0] ];
        this.parseQ(fnQ);
      break;

      default:
        for (var i = 0; i < fnQ.length; i += 1) {
          if(typeof fnQ[i][0] === 'function') {
            this.parseQ(fnQ[i]);
          } else if(typeof fnQ[i][0] === 'string') {
            fnQ[i][0] = this.fnCache[ fnQ[i][0] ];
            this.parseQ(fnQ[i]);
          }
        }
      break;
    }
  }

};

window.optly.mrkt.services.xhr = {
  makeRequest: function(request) {
    var deferreds = [], deferredPromise;

    // check if multiple requests are present
    if ( Array.isArray(request) ) {
      for (var i = 0; i < request.length; i += 1) {
        if (typeof request[i] === 'object') {
          deferredPromise = $.ajax({
            type: request[i].type,
            url: request[i].url
          });
          // parameters passed must be objects with a path and properties keys
          if (request[i].properties !== undefined) {
            this.handleErrors( deferredPromise, request[i].url, request[i].properties );
          }

          deferreds.push( deferredPromise );

        }
      }
      this.resolveDeferreds(deferreds);
      return deferreds;
    }
    // If single request, then return the promise directly
    else {
      deferredPromise = $.ajax({
        type: request.type,
        url: request.url
      });
      if (request.properties !== undefined) {
        this.handleErrors( deferredPromise, request.url, request.properties );
      }
      return deferredPromise;
    }
  },

  logSegmentError: function(category, action, label) {
    window.analytics.ready(function() {
      window.analytics.track(action, {
        category: category,
        label: label
      }, {
        integrations: {
          Marketo: false
        }
      });
    });
  },

  validateTypes: function(resp, properties, apiEndpoint) {
    var errorMessage;
    $.each(properties, function(property, type) {
      // if property is not nested
      if(typeof type !== 'object') {
        if (typeof resp[ property ] !== type) {
          // acctData often comes back as null, but JS will report typeof null to be an object
          errorMessage = 'resp.' + property + ' is not a ' + type + ': ' + ( resp[property] === null ? 'null' : typeof(resp[property]) );

          this.logSegmentError('api error', apiEndpoint, errorMessage);
        }
      }
      // if property is nested
      else {

        this.validateNestedTypes( resp[ property ], properties[ property ], property, type, apiEndpoint );

      }
    }.bind(this)); // end outer .each
  },

  validateNestedTypes: function(data, nestedData, parentProperty, type, apiEndpoint) {
    var errorMessage,
      propertyType;
    // if the property maps to an array
    if ( Array.isArray(data) ) {

      $.each(data, function(index, innerProperties) {

        $.each(nestedData, function(innerProp, innerType) {
          propertyType = typeof innerProperties[ innerProp ];
          if (propertyType !== innerType) {
            errorMessage = 'resp.' + parentProperty + '.' + innerProp + ' is not a ' + innerType + ': ' + propertyType;

            this.logSegmentError('api error', apiEndpoint, errorMessage);
          }
        }.bind(this));

      }.bind(this));
    }
    // if the property maps to an object
    else {
      $.each(type, function(innerProp, innerType) {
        propertyType = typeof data[ innerProp ];
        if (propertyType !== innerType) {
          errorMessage = 'resp.' + parentProperty + '.' + innerProp + ' is not a ' + innerType + ': ' + propertyType;

          this.logSegmentError('api error', apiEndpoint, errorMessage);
        }
      }.bind(this));
    }
  },

  handleErrors: function(deferred, apiEndpoint, properties) {
    var parsedRes,
      errorMessage,
      isExpEndpoint = /\/experiment/.test(apiEndpoint);

    deferred.always(function(data, textStatus, jqXHR) {

        // check if the last argument is a promise, if so the response was successful
        if( this.isPromise(jqXHR) && jqXHR.status === 200 ) {

          //parse JSON and catch any errors -- if error return immediately
          try {
            parsedRes = JSON.parse(jqXHR.responseText);
          } catch (error) {
              if(!isExpEndpoint) {
                window.optly.mrkt.errorQ.push([
                  'logError',
                  {
                    error: 'There was an error in your account data.',
                  }
                ]);
              }
              this.logSegmentError('api error', apiEndpoint, 'response contains invalid json ' + error);

              // do not check validations if parse error
              return undefined;
          }

          // validate each property type
          this.validateTypes(parsedRes, properties, apiEndpoint);

        }
        // if the http request fails the jqXHR object will not be promise
        else {
          // in this case the data object is a promise so we parse it's response text
          if ( this.isPromise(data) ) {
            try {
              parsedRes = JSON.parse(data.responseText);
            } catch (error) {
                errorMessage = error + ', Response Text: ' + data.responseText + ', Status Text: ' + data.statusText + ', Status: ' + data.status;
                if(!isExpEndpoint) {
                  window.optly.mrkt.errorQ.push([
                    'logError',
                    {
                      error: 'There was an error in your account data.',
                    }
                  ]);
                }
            }

            if (errorMessage === undefined && data.status !== 200) {
              if(parsedRes && parsedRes.id) {
                delete parsedRes.id;
                parsedRes = JSON.stringify(parsedRes);
              } else {
                parsedRes = data.responseText;
              }
              errorMessage = 'Response Text: ' + parsedRes + ', Status Text: ' + data.statusText + ', Status: ' + data.status;
              if(!isExpEndpoint) {
                window.optly.mrkt.errorQ.push([
                  'logError',
                  {
                  error: JSON.parse(data.responseText).error ? JSON.parse(data.responseText).error : 'We were unable to retrieve your account information.',
                  'error_id': JSON.parse(data.responseText).id
                  }
                ]);
              }
            }

            this.logSegmentError('api error', apiEndpoint, errorMessage);

          }

        }

    }.bind(this));

  },

  isPromise: function(value) {

    if (typeof value.then !== 'function') {
        return false;
    }
    var promiseThenSrc = String($.Deferred().then);
    var valueThenSrc = String(value.then);
    return promiseThenSrc === valueThenSrc;
  },

  resolveDeferreds: function(deferreds) {
    var responses = [], oldQue;
    $.when.apply($, deferreds).then(function() {
      // get all arguments returned from done
      var tranformedArgs = Array.prototype.slice.call(arguments);
      $.each(tranformedArgs, function(index, resp) {
        var respData = resp[0];
        if( !this.isPromise( respData ) && resp[1] === 'success' ) {
          responses.push(respData);
        }
        if (index === tranformedArgs.length - 1) {
          oldQue = window.optly_q;

          window.optly_q = window.optly.mrkt.Optly_Q(responses[0], responses[1]);
          window.optly_q.push(oldQue);
        }
      }.bind(this) );
    }.bind(this), function() {

      deferreds[0].then(function(acctData) {
        // check if acctData properties are not null
        if(!!acctData.account_id && !!acctData.email) {
          //if there is no error in account info instantiate the Q with no exp data
          oldQue = window.optly_q;

          window.optly_q = window.optly.mrkt.Optly_Q(acctData);
          window.optly_q.expDataError = true;
          window.optly_q.push(oldQue);
        } else {
          //TODO dfox-powell find way to delete the signed in cookie, potentially load jQuery cookie first Fri Dec  5 16:03:20 2014
          //if acctData is null instantiate the Q with no arguments and remove optimizely signed in cookie
          window.optly_q = window.optly.mrkt.Optly_Q();
        }
      }.bind(this), function() {
        //if acctData error instantiate the Q with no arguments
        window.optly_q = window.optly.mrkt.Optly_Q();
      });
    }.bind(this) );

    return true;
  },

  readCookie: function (name) {
    name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');

    var regex = new RegExp('(?:^|;)\\s?' + name + '=(.*?)(?:;|$)','i'),
        match = document.cookie.match(regex);

    return match && window.unescape(match[1]);
  },

  getLoginStatus: function(requestParams) {
    var deferreds;

    if ( !!this.readCookie('optimizely_signed_in') ) {
      deferreds = this.makeRequest(requestParams);
    } else {
      window.optly_q = window.optly.mrkt.Optly_Q();
    }

    return deferreds;
  }

};

(function() {
  'use strict';

  var acctParams,
    expParams;

  acctParams = {
    type: 'GET',
    url: window.apiDomain + '/account/info',
    properties: {
      email: 'string',
      account_id: 'number'
    }
  };

  expParams = {
    type: 'GET',
    url: window.apiDomain + '/experiment/load_recent?max_experiments=5',
    properties: {
      experiments: {
        id: 'number',
        description: 'string',
        has_started: 'boolean',
        can_edit: 'boolean'
      }
    }
  };

  window.optly.mrkt.services.xhr.getLoginStatus([acctParams, expParams]);
}());
