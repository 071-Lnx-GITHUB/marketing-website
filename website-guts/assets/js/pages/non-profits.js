var player;
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var scriptTags = document.getElementsByTagName('script');
var lastScriptTag = scriptTags[scriptTags.length - 1];
lastScriptTag.parentNode.insertBefore(tag, lastScriptTag.nextSibling);

window.onYouTubeIframeAPIReady = function () {
  player = new window.YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'C7WTDPksvAE'
  });
};

$(function(){
  var videoPlayed = false,
    playerSupported = false;

  $('[smooth-scroll]').on('click', w.optly.mrkt.utils.smoothScroll);

  $('[data-show-video]').on('click', function() {
    window.optly.mrkt.modal.open({modalType: 'nonprofits-video'});
    if(typeof player === 'object' && typeof player.getPlayerState === 'function') {
      playerSupported = true;
      //deal with the lack of autoplay upon inital open for mobile
      if(!window.optly.mrkt.isMobile() || videoPlayed) {
        var playerInt = window.setInterval(function() {
          if(player.getPlayerState() !== 1) {
            player.playVideo();
          } else {
            window.clearInterval(playerInt);
          }
        }, 10);
      }
    } else {
      if(!videoPlayed) {
        $('#player').css({display: 'none'});
        $('.fallback-player').addClass('show-fallback');
      }
      $('.fallback-player').attr('src', '//www.youtube.com/embed/C7WTDPksvAE?autoplay=1');
    }
    if(!videoPlayed) {
      videoPlayed = true;
    }
  });

  $('[data-optly-modal="nonprofits-video"]').on('click', function() {
    if(playerSupported) {
      player.stopVideo();
    } else {
      $('.fallback-player').attr('src', '');
    }
  });

  var orgFormHelperInst = window.optly.mrkt.form.orgForm({formId: 'org-form'});

  $(orgFormHelperInst.formElm).on('submit', function(e) {
    //simple form which submits to: action="https://pages.optimizely.com/index.php/leadCapture/save2"
    console.log('You are in the on submit jquery function in the form! it\'s a function of e, which is: ', e);
    e.preventDefault();
    //This is the only instance of validateForm in our codebase
    this.validateForm();
  }.bind(orgFormHelperInst));

});
