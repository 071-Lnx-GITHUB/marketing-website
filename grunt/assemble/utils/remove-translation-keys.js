var _ = require('lodash');
var splitKey = require('./split-key');

module.exports = function(assemble) {
  var linkPath = assemble.get('data.linkPath');

  /**
   * Utility function for removing TR|MD|HTML YML translation prefixes
   *
   * @param {Object} `fileData` Assemble File data object
   * @param {String} `locale` Assemble File data object
   * @return {Object} Mutates `fileData` object passed to it
   *
   */
  return function(fileData, locale) {

    /**
     * Utility function for removing TR|MD|HTML YML translation prefixes for arrays
     *
     * @param {Array} `arr` found array from traversing the object passed to removeTranlsationKeys for translation keys
     * @param {Function} `parserFn` removeTranslationKeys function to be called recursively
     * @return {Object} Mutates `arr` array and returns it
     *
     */
    function processTransArray(arr, parserFn) {
      arr.forEach(function(item) {

        if (_.isPlainObject(item)) {
          parserFn(item);
        } else if (_.isArray(item)) {
          processTransArray(item);
        }
      });
      return arr;
    }

    /**
     * Utility function for removing TR|MD|HTML YML translation prefixes
     *
     * @param {Object} `fileData` Assemble File data object
     * @return {Object} Mutates `fileData` object passed to it
     *
     */
    function removeTranslationKeys(fileData) {
      _.forEach(fileData, function(val, key) {
        var parsedKey, split;
        /**
         * splitKey only splits at translation keys (TR|MD|HTML)
         */
        split = splitKey(key);

        if (_.isArray(split)) {
          parsedKey = {
            prefix: split[0],
            key: split[1]
          };
        }

        if (parsedKey) {
          if (_.isPlainObject(val)) {
            val = removeTranslationKeys(val);
          } else if (_.isArray(val)) {
            val = processTransArray(val, removeTranslationKeys);
          } else {
            /**
             * Defensive coding to remove double line breaks created by l10n-tools
             */
            if (/\\n+/g.test(val)) {
              val = val.replace(/\\n+/g, '');
            }

            /**
             * Replaces linkPaths in anchor tags that begin with /dist, but not with /dist/<current_locale>/
             * because MD is preparsed accounting for linkPath, but if templated does not exist in subfolder
             * it will be parsed as in the Root locale. This replacement accounts for inheritance.
             * ex. `/press` & `/resources/split-testing`
             * TODO: don't hardcode linkPath, but this is tricky because assemble.get('linkPath') varies per locale
             */
            if (parsedKey.prefix === 'HTML' && locale) {
              var pathRe = new RegExp(linkPath + '\/(?!' + locale + '\/)', 'g');
              if (locale && pathRe.test(val)) {
                val = val.replace(pathRe, linkPath + '/' + locale + '/');
              }
            }
          }

          /**
           * Attach the parsed `val` to the `fileData` object with a key that has the translation prefix
           * removed, and subsequently delete the translation key/value pair.
           * Important to check for existing key because this allows pre-translated values
           * in external YML to overwrite translated values of parent YML
           */
          if (!fileData[ parsedKey.key ]) {
            fileData[ parsedKey.key ] = val;
          }
          delete fileData[key];

        } else {

          /**
           * Recurse the object to remove translation keys even if the top-level key is not
           * flagged for translation.
           */
          if (_.isPlainObject(val)) {
            fileData[key] = removeTranslationKeys(val);
          }

        }//end if checking for `parsedKey`

      });//end forEach

      return fileData;
    }

    /**
     * Call function immediately because it needs to be able to be called in the scope with `locale`
     */
    return removeTranslationKeys(fileData);
  };
};
