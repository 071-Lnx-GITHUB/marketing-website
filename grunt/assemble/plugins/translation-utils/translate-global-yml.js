var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var fixHTMLEscape = require('./fix-html-escape');

module.exports = function(assemble) {
  var removeTranslationKeys = require('../../utils/remove-translation-keys')(assemble);
  var curryTryCatch = require('../../utils/curry-try-catch');
  var filterLocales = curryTryCatch(require('../../utils/filter-locales')(assemble));

  /**
   *
   * Create an object with global translations scoped to the locale. This is necessary
   * in order to parse `linkPath` that might have been templated incorrectly in Markdown
   *
   * @param {String} `localeCode`
   * @param {Object} `globalYml` global yml data prefixed with `global_`
   * @param {Object} `translations` translations object created from smartling download
   * @return {Object} `tranlatedGlobal` global data translated and scoped to the locale
   */
  return function translateGlobalYml(localeCode, globalYml, translations) {
    var filteredLocales = filterLocales(localeCode);
    var translatedGlobal = filteredLocales.reduce(function(memo, locale) {
      memo[locale] = Object.keys(globalYml).reduce(function(o, fp) {
        var val = globalYml[fp];
        var basenameKey = path.basename(fp, path.extname(fp));
        var clone = _.cloneDeep(val);

        o[basenameKey] = objParser.translate(clone, translations[localeCode]);
        fixHTMLEscape(o[basenameKey]);
        return o;
      }, {});

      removeTranslationKeys(memo[locale], locale);
      return memo;
    }, {});

    return translatedGlobal;
  };
};
