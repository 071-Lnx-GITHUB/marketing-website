module.exports = function (name)  {
  var websiteRoot = this.app.get('data.websiteRoot');
  var locale = this.context.locale;

  if (locale && locale !== websiteRoot) {
    name = locale + '_' + name;
  }

  return name;
};
