/**
 * Utility function for splitting YML translation keys at the first `_` underscore
 *
 * @param {String} `key` YML key for translation
 * @return {Array || String} If not a translation key then a string is returned
 */
module.exports = function(key) {
  var split;

  // TODO: remove this overly specific code
  if (/^(TR|HTML)_/.test(key)) {
    split = key.split(/_(.+)?/);

    split = split.filter(function(item) {
      if (!!item) {
        return item;
      }
    });
  }

  return split || key;
};
