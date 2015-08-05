var path = require('path');
var _ = require('lodash');
var marked = require('optimizely-marked');
var splitKey = require('./split-key');
var kindOf = require('kind-of');

/**
 *
 * @param {Object} `assemble` the Assemble instance
 * @return {Object} a new object with only values to be translated and their associate translation keys.
 *
 */
module.exports = function (assemble) {
  var locales = assemble.get('data.locales');

  /**
   *
   * Array will only be translated if key defining the array has a TR or MD flag
   * otherwise keys like layout_body_class or src containing arrays would be put into
   * translation dict. If the array contains only strings all those strings will be returned
   * for translation. If it contains an object only those keys with TR|MD will be processed
   *
   * @param {Array} `arr` Array to be processed
   * @param {String} `type` Type of translation key (TR|MD)
   * @param {Function} `parserFn` createDictionary function to be called recursively
   * @return {Array} an array with only values to be translated
   */
  function processArray(arr, type, parserFn) {
    var reduced =  arr.reduce(function(map, item, index) {
      var val;
      if (_.isPlainObject(item)) {
        val = parserFn(item);
      } else if (_.isArray(item)) {
        val = processArray(item, type, parserFn);
      } else if (type === 'MD') {
        val = marked(item);
      } else {
        val = item;
      }

      if (val) {
        map.push(val);
      }
      return map;
    }, []);

    return reduced;
  }

  /**
   *
   * Utility function to determine if the key/value pair represents entire (HTML|MD) flagged for translation
   * @param {String} `key` key flagged for translation
   * @param {Array|undefined} `split` value returned from `splitKey` function
   * @param {Object} `fileObj` the `fileData` object being acted upon
   * @param {Object|Function} `mdParser` the `marked` markdown parser
   * @return {Object|Boolean} returns the page content or the parsed MD page content `val` or `false`
   */
  function translatePageContent(key, split, fileObj, mdParser) {
    var prefix = split[0];
    var suffix = split[1];
    var pageContent, val;
    var isPageContent = fileObj.data && fileObj.data[key] && suffix === 'page_content';
    if (isPageContent) {
      if (kindOf(fileObj.contents) === 'buffer') {
        pageContent = fileObj.contents.toString(); //convert the buffer object
      } else {
        pageContent = fileObj.contents;
      }
      val = (prefix === 'MD') ? mdParser(pageContent) : pageContent;
      delete fileObj.data[key];

      return val;
    } else {
      return false;
    }
  }

  /**
   * Utility function to traverse `fileData` object creating a new object with key/value pairs that
   * were flagged for translation.
   *
   * @param {Object} `fileData` YFM and external YML data associated with the Assemble `file` object
   * @param {String} `locale` locale the fileData is associated with
   * @return {Object} an object containing only key/value pairs flagged for translation
   */
  var createDictionary = function createDictionary(fileData, locale) {
    //return early if given an empty object or a non `maplike` structure
    //use `kindOf` because buffers are misenterpreted by loadash
    if (kindOf(fileData) !== 'object') {
      return {};
    }
    var linkPath = assemble.get('data.linkPath');
    var data = fileData.data || fileData;
    var translationKeys = [
      'TR',
      'MD',
      'HTML'
    ];

    if (Object.keys(locales).indexOf(locale) !== -1) {
      linkPath = path.join(linkPath, locale);
    }

    //set the markdown parser options
    marked.setOptions({
      linkPath: linkPath,
      smartypants: true
    });

    return Object.keys(data).reduce(function(o, key) {
      var split = splitKey(key);
      var prefix = split[0];
      var suffix = split[1];
      var val, recursed;
      var isPageContent = translatePageContent(key, split, fileData, marked);

      if (translationKeys.indexOf(prefix) !== -1 && isPageContent) {
        //key will get mutated to have an HTML prefix inside the translatePageContent function
        val = isPageContent;
        key = 'HTML_' + suffix;
      } else if ((translationKeys.indexOf(prefix) !== -1) && (data[key] !== 'object' || Array.isArray(data[key]))) {
        //if it's an array remember the key
        if (Array.isArray(data[key])) {
          val = processArray(data[key], prefix, createDictionary);
        } else if (prefix === 'MD') {
            val = marked(data[key]);
            //mutate the original object for later page data extension
            //with parsed markdown
            delete data[key];
            key = 'HTML_' + suffix;
            data[key] = val;
        } else {
          val = data[key];
        }

        //fucking null....are you kidding me!!!!
      } else if (_.isPlainObject(data[key])) {
        recursed = createDictionary(data[key]);
        //this is important, keeps keys with empty values from being added
        if (Object.keys(recursed).length > 0) {
          o[key] = recursed;
        }
      }
      if (val) {
        o[key] = val;
      }
      return o;
    }, {});
  };
  return createDictionary;
};
