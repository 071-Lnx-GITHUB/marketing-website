'use strict';

var _ = require('lodash');
var through = require('through2');

module.exports = function (assemble) {
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var removeTranslationKeys = require('../utils/remove-translation-keys')(assemble);
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var pageData = assemble.get('pageData');
  var pageDataClone = _.cloneDeep(pageData);
  var websiteRoot = assemble.get('data.websiteRoot');

  return through.obj(function (file, enc, cb) {
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dataKey = filePathData.dataKey;
    var trYfm, trYml, layoutData;

    pageDataClone[locale] = pageDataClone[locale] || {};
    pageDataClone[locale][dataKey] = pageDataClone[locale][dataKey] || {};

    /**
     * cache the layout data and remove it from the file.data object before translation parsing
     * because layout data will be added to pageDataClone through the plugin
     */
    if (file.data.layouts) {
      layoutData = file.data.layouts;
      delete file.data.layouts;
    }

    /**
     * get TR|MD prefixed keys and swap out MD content for HTML content
     */
    trYfm = createTranslationDict(file, locale);

    /**
     * add all the parsed YFM to the page data object
     */
    _.merge(pageDataClone[locale][dataKey], trYfm);

    trYml = createTranslationDict(pageDataClone[locale][dataKey], locale);

    if (file.data.modals) {
      pageDataClone[locale][dataKey].modals = file.data.modals;
    }

    if (layoutData) {
      pageDataClone[locale][dataKey].layouts = layoutData;
    }

    this.push(file);
    cb();
  }, function (cb) {
    var globalData = assemble.get('data');
    var q = require('q');
    var promise = q();
    var curryTryCatch = require('../utils/curry-try-catch');

    promise.then(function() {
      var mergeLayoutData = curryTryCatch(require('./translation-utils/merge-layout-data')(assemble));

      mergeLayoutData(pageDataClone);
      removeTranslationKeys(pageDataClone[websiteRoot]);
      removeTranslationKeys(globalData);
      assemble.set('rootData', pageDataClone[websiteRoot]);
      cb();
    })
    .catch(function(error) {
      this.emit('error', error);
    }.bind(this));
  });

};
