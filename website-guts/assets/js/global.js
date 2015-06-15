require('exports?window.History!history.js/scripts/bundled-uncompressed/html4+html5/jquery.history');
require('exports?window.Oform!oForm/src/oForm');

/**
 * These function calls bootstrap all of the global files, essentially requiring them in
 * to mimic concat behavior. This is a temporary solution until we begin `require`ing utilities
 * into page level JS rather than referencing them as globals.
 * RegEx excludes files that have already been required in a specific order or those that should be omitted.
 *
 * Function require.context
 * @returns {Object}
 * ex. {
 *  './utils/form_helper_facory.js': fucntion(fp) {
 *    //when executed this function will call all code inside the specified module
 *  }
 * }
 */
var allGlobals = [
  require.context('./utils', false, /^(?!\.\/form-filler\.js).*\.js$/),
  require.context('./utils/form_helpers', false, /\.js$/),
  require.context('./globals', false, /\.js$/),
  require.context('./components', false, /\.js$/),
  require.context('./services', false, /^(?!\.\/user_state\.js).*\.js$/)
];

var each = function(arr, fn) {
  for(var i=0; i < arr.length; i+=1) {
    fn(arr[i], i);
  }
};

each(allGlobals, (context) => {
  if(typeof context.keys === 'function') {
    each(context.keys(), context);
  }
});
