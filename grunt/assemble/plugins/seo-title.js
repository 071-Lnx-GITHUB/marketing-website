var _ = require('lodash');
var through = require('through2');

module.exports = function(assemble) {
  var parseFilePath = require('../utils/parse-file-path')(assemble);

  /**
   * Capitalize first character of a string unless it is a number
   *
   * @param {String} `str` dirname string.
   * @return {String} capitalized string.
   */
  function cap(str) {
    var firstChar = str.charAt(0);
    if (isNaN(firstChar)) {
      return firstChar.toUpperCase() + str.slice(1);
    } else {
      return str;
    }
  }

  /**
   * Parse a string for slashes. If they exist replace with spaces and capitalize first letter of each string.
   *
   * @param {String} `str` dirname string.
   * @return {String} capitalized string.
   */
  function parseDirname(str) {
    var split;
    if (str.indexOf('-') !== -1) {
      split = str.split('-');
      return split.map(function(splitStr) {
        return cap(splitStr);
      }).join(' ');
    } else {
      return cap(str);
    }
  }

  /**
   * Plugin to add SEO title
   * - if SEO title exists use it
   * - if title exists then use the capitalized dirname plus a suffix
   * - if visible_title exists use it plus a suffix
   */
  return through.obj(function(file, enc, callback) {
    var fpData = parseFilePath(file.path);

    var possibleTitles = [
      'TR_visible_title',
      'title'
    ];
    var seoTitle = ['TR_seo_title', 'seo_title'];
    var seoSuffix = ' - Optimizely';
    var defaultTitle = 'Optimizely: Make every experience count';

    var keys = Object.keys(file.data);
    var altTitle, dirname;

    if (fpData.isRoot || fpData.isSubfolder) {
      if (!_.intersection(keys, seoTitle).length) {
        altTitle = _.intersection(possibleTitles, keys)[0];

        switch (altTitle) {
          case possibleTitles[1]:
            dirname = file.data.src.dirname;
            dirname = dirname.substr(dirname.lastIndexOf('/') + 1);
            file.data.TR_seo_title = parseDirname(dirname) + seoSuffix;
            break;
          default:
            file.data.TR_seo_title = altTitle ? file.data[altTitle] + seoSuffix : defaultTitle;
        }
      }
    }

    this.push(file);
    callback();
  });
};
