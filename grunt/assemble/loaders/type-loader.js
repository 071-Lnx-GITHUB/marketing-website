var _ = require('lodash');

module.exports = function (assemble) {
  var locales = assemble.get('data.locales');

  return function typeLoader(templates) {
    var keys = Object.keys(templates);
    var localeKeys = Object.keys(locales);

    keys.forEach(function (key) {
      localeKeys.forEach(function (locale) {
        var localeKey = locale + '_' + key;
        templates[localeKey] = _.merge({}, templates[key]);
        templates[localeKey].data = templates[localeKey].data || {};
        templates[localeKey].data.locale = locale;
      });
    });
    return templates;
  };
};
