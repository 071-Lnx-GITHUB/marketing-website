var tr = require('l10n-tr');

module.exports = function _tr() {
  var app = this.app;
  var dict;
  if(app){
    // running on server-side env
    var websiteRoot = app.get('data.websiteRoot');
    var locale = this.context.locale || websiteRoot;
    if (locale !== websiteRoot) {
      // translate messages only for non-English subfolders
      var locales = app.get('data.locales');
      dict = app.get('translations')[locales[locale]];
    }
  //} else if(window && window.optlyDict) {
  //  dict = window.optlyDict;
  }

  tr.setDict(dict);
  return tr.apply(tr, arguments);
};
