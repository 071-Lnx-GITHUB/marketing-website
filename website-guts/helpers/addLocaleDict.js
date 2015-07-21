module.exports = function addLocalDict(options) {
  var app = this.app;
  var locales = app.get('data.locales');
  var locale = this.context.locale;
  var dictKey = locales[locale];

  if(locales[locale]) {
    return options.fn({dictKey: dictKey});
  } else {
    return options.inverse(this);
  }

};
