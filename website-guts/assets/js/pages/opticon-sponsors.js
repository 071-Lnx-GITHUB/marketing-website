$('[data-modal]').on('click', function(e) {
  e.preventDefault();
  window.optly.mrkt.modal.open({modalType: 'opticon-sponsor-modal', staticModal: true});
  $('.js-company-image').css('background-image', this.style.backgroundImage).attr('href', this.getAttribute('data-link'));
  $('.js-company-name').html(this.getAttribute('data-name')).attr('href', this.getAttribute('data-link'));
  $('.js-company-description').html(this.getAttribute('data-description'));
});
$('.js-close').on('click', function() {
  window.optly.mrkt.modal.close({modalType: 'opticon-sponsor-modal'});
});
