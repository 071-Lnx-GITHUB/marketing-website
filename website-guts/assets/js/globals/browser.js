var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || 'Other';
    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'Unknown';
  },
  searchString: function (data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      this.versionSearchString = data[i].subString;

      if (dataString.indexOf(data[i].subString) !== -1) {
        return data[i].identity;
      }
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index === -1) {
      return;
    }

    var rv = dataString.indexOf('rv:');
    if (this.versionSearchString === 'Trident' && rv !== -1) {
      return parseFloat(dataString.substring(rv + 3));
    } else {
      return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    }
  },

  dataBrowser: [
    {string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome'},
    {string: navigator.userAgent, subString: 'MSIE', identity: 'Explorer'},
    {string: navigator.userAgent, subString: 'Trident', identity: 'Explorer'},
    {string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox'},
    {string: navigator.userAgent, subString: 'Safari', identity: 'Safari'},
    {string: navigator.userAgent, subString: 'Opera', identity: 'Opera'}
  ]

};

BrowserDetect.init();

window.optly.mrkt.browser = BrowserDetect.browser;

window.optly.mrkt.browserVersion = BrowserDetect.version;

window.optly.mrkt.isMobile = function(){

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

    return true;

  } else {

    return false;

  }

};

window.optly.mrkt.mobileJS = function(){

  if( window.optly.mrkt.isMobile() ){

    $('body').addClass('mobile');

    $.getScript(window.optly.mrkt.assetsDir + '/js/libraries/fastclick.min.js', function(){

      window.FastClick.attach(document.body);

    });

  }

  var querystring = window.optly.mrkt.utils.deparam(window.location.href);

  if( (querystring.site_mode && querystring.site_mode === 'mobile') ) {
    $.cookie('optimizelySiteMode', 'mobile', { path: '/' });
  }

  var mobileNavBound = false;
  $(window).on('load resize', function() {
    if(window.innerWidth <= 960) {
      $('body').addClass('mobile-nav-ready');

      if(!mobileNavBound) {
        $('.mobile-nav-toggle').on('click', function(e){

          $('body').toggleClass('nav-open');

          e.preventDefault();

        });

        $('.user-nav-toggle').on('click', function(e){

          $('body').toggleClass('user-nav-open');

          e.preventDefault();

        });



        $('#main-nav > li').on('click', function(){

          $(this).toggleClass('active').find('ul').toggleClass('active');

        });

        mobileNavBound = true;
      }


    } else {
      $('body').removeClass('mobile-nav-ready');
    }

  });


};

window.optly.mrkt.mobileJS();

