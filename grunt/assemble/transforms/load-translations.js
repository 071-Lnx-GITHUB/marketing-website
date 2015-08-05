'use strict';
var path = require('path');
var extend = require('extend-shallow');
/**
 * args =>
 *  0 => name
 *  1 => transform
 *  2 => patterns
 *  3 => locale
 */

//method scopes page data from YML file in same directory onto the `lang` object
//must remember to account for YML data that is intended to be global
module.exports = function translationTransform (assemble, args) {
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var pageData = assemble.get('pageData') || {};
  var translationType = args[0];
  var patterns = args[2];
  var locale = args[3];
  var processYMLfile = require('./translation-helpers/yml-file-data')(assemble);
  var data;

  patterns = Array.isArray(patterns) ? patterns : [patterns];

  if (/page/.test(translationType)) {
    data = processYMLfile(patterns, locale);
  } else if (/subfolder/.test(translationType)) {
    data = processYMLfile(patterns, path.join(subfoldersRoot, locale));
  } else {
    //NOTE: this was omitted and is being performed in the smartling plugin
    //put partial, modal, layout specific parsing here is necessary
    translationType = translationType.split('-')[0];
  }

  if (Object.keys(data).length) {
    pageData[locale] = extend({}, pageData[locale], data);
    // this transform fetches all of the YML data in the files same directory
    assemble.set('pageData', pageData);
  }
};

