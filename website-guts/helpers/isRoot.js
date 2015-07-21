module.exports = function (options) {
  var app = this.app;
  var websiteRoot = app.get('data.websiteRoot');
  var locale = this.context.locale;

  if(locale === undefined || locale === websiteRoot) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};


