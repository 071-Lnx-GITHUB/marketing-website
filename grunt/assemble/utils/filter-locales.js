module.exports = function(assemble) {
  var locales = assemble.get('config.options.locales');
  /**
   *
   * filter to add all locales with the same language key
   *
   * @param {String} `localeCode` ex. `de_DE`
   * @return {Array} array of locales associated with the locale code ex. `['de', 'chde']`
   */
  return function filterLocales(localeCode) {
    return Object.keys(locales).filter(function(locale) {
      if(locales[locale] === localeCode) {
        return true;
      }
    });
  };
};
