/**
 * Utility function to append locale specific data to oForm payload object sent to /account/create endpoint
 *
 * @param {String} `data` string of form data encoded by oForm
 * @return {String} encoded locale string to be appended to the oForm `data` string in the oForm middleware
 */
function tld2locale(tld){
  switch(tld){
    case 'de': return 'de_DE';
    case 'fr': return 'fr_FR';
    case 'es': return 'es_ES';
    case 'jp': return 'ja_JP';
    default: return 'en_US';
  }
}

module.exports = function() {
  // extract TLD from current URL
  var tld = window.location.hostname.split('.').pop();
  return window.encodeURI('&locale=' + tld2locale(tld));
};
