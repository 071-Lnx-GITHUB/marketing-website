module.exports = function (options) {
  var app = this.app;
  var websiteRoot = app.get('data.websiteRoot');
  var locales = app.get('data.locales');
  var locale = this.context.locale;

  if(locale !== websiteRoot && locales[locale]) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

