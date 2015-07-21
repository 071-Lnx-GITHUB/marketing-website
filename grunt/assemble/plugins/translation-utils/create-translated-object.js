var _ = require('lodash');

module.exports = function(assemble) {
  var curryTryCatch = require('../../utils/curry-try-catch');
  var filterLocales = curryTryCatch(require('../../utils/filter-locales')(assemble));

  /**
   *
   * Creates an object with all translations scoped to filepath per language key
   * i.e. (de & chde) have the same language key `de_DE`
   *
   * @param {String} `locale` locale to check
   * @param {Object} `pageDataClone` page data object
   * @return {Object} an object with all translated data per language key scoped under filepath
   */
  return function createTranslatedObject(localeCode, pageDataClone) {
    var filteredLocales = filterLocales(localeCode);

    /**
     * loop over all locales that are associated with the same localeCode and add them
     * to an object by file path
     */
    return filteredLocales.reduce(function(o, pageDataKey) {
      _.forEach(pageDataClone[pageDataKey], function(val, fp) {
        if(!o.hasOwnProperty(fp)) {
          o[fp] = _.cloneDeep(val);
        }
      });

      return o;
    }, {});

  };
};
