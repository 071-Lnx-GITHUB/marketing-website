var _ = require('lodash');
var hbsParser = require('l10n-tools/hbs-parser');
var through = require('through2');

module.exports = function(assemble) {
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var removeTranslationKeys = require('../utils/remove-translation-keys')(assemble);
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var getGlobalYml = require('./translation-utils/get-global-yml');

  var globalData = assemble.get('data');
  var globalYml = getGlobalYml(globalData); // TODO: fix this so it doesn't mucking with globalData
  var pageData = assemble.get('pageData');
  var pageDataClone = _.cloneDeep(pageData);

  var locales = assemble.get('config.options.locales');
  var websiteRoot = assemble.get('config.options.websiteRoot');

  var lang = assemble.get('lang') || {}; // TODO: rename this

  /**
   * add the global yml keys flagged for translation to the lang object to be parsed and sent to smartling
   */
  lang.global = createTranslationDict(globalYml, 'global');

  return through.obj(function(file, enc, callback) {
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dataKey = filePathData.dataKey;

    pageDataClone[locale] = pageDataClone[locale] || {};
    pageDataClone[locale][dataKey] = pageDataClone[locale][dataKey] || {};

    lang[locale] = lang[locale] || {};
    lang[locale][dataKey] = lang[locale][dataKey] || {};

    var trYfm, trYml, layoutData;

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

    /**
     * Add extracted phrases as translation key so they will be sent to smartling
     */
    if (file.contents) {
      trYml.TR_hbs_extracted = hbsParser.extract(file.contents.toString());
    }

    /**
     * extend the lang object with data from the YFM of file.data and external yml data
     */
    if (Object.keys(trYml)) {
      lang[locale][dataKey] = trYml;
    }

    if (file.data.modals) {
      pageDataClone[locale][dataKey].modals = file.data.modals;
    }

    if (layoutData) {
      pageDataClone[locale][dataKey].layouts = layoutData;
    }

    this.push(file);
    callback();
  }, function(callback) {
    var curryTryCatch = require('../utils/curry-try-catch');
    var mergeSubfolderYml = curryTryCatch(require('./translation-utils/merge-subfolder-yml')(assemble));
    mergeSubfolderYml(lang, pageDataClone);
    assemble.set('lang', lang);
    var sendToSmartling = curryTryCatch(require('./translation-utils/smartling-upload')(assemble));

    sendToSmartling().then(function(resolved) {
        var populateSubfolderData = curryTryCatch(require('./translation-utils/populate-subfolder-data')(assemble));
        var translatePageData = curryTryCatch(require('./translation-utils/translate-page-data')(assemble));
        var mergeLayoutData = curryTryCatch(require('./translation-utils/merge-layout-data')(assemble));
        var createTranslatedObject = curryTryCatch(require('./translation-utils/create-translated-object')(assemble));
        var translateGlobalYml = curryTryCatch(require('./translation-utils/translate-global-yml')(assemble));
        var translateAssembleViews = curryTryCatch(require('./translation-utils/translate-assemble-views')(assemble));
        var translations = resolved[0];

        /**
         * iterate through locales to create complete the `pageDataClone` object
         *
         * pageDataClone = {
         *  website: {
         *    fp: 'val'
         *  },
         *  de: {
         *    fp: 'val'
         *  },
         *  modals: {
         *    fp: 'val'
         *  }
         * }
         */
        Object.keys(locales).forEach(function(locale) {
          populateSubfolderData(locale, pageDataClone);
          translatePageData(locale, pageDataClone, translations);
          removeTranslationKeys(pageDataClone[locale], locale);
        });

        removeTranslationKeys(pageDataClone[websiteRoot]);

        mergeLayoutData(pageDataClone);

        /**
         * iterate through locales to create a `translated` object
         * `translated` will become the dictionary for pages
         *
         * translated = {
         *  de_DE: {
         *    fp: 'val'
         *  },
         *  fr_FR: {
         *    fp: 'val'
         *  }
         * }
         */
        var langKeys = Object.keys(locales).reduce(function(cache, locale) {
          var langKey = locales[locale];
          if (cache.indexOf(langKey) === -1) {
            cache.push(langKey);
          }

          return cache;
        }, []);

        var translated = langKeys.reduce(function(memo, localeCode) {

          //create the translated object making sure to account for multiple domains potentially
          //associated with the same translation key
          memo[localeCode] = createTranslatedObject(localeCode, pageDataClone);

          //translate the global yml and attach it to the translated object to be swapped out in the middleware
          memo[localeCode].global = {};
          memo[localeCode].global = translateGlobalYml(localeCode, globalYml, translations);

          return memo;
        }, {});

        removeTranslationKeys(globalData);
        translateAssembleViews(translated);

        assemble.set('rootData', pageDataClone[websiteRoot]);
        assemble.set('translated', translated);
        assemble.set('translations', translations); // Store retrieved from Smartling translations object
        callback();
      })
      .catch(function(error) {
        this.emit('error', error);
      }.bind(this));
  });
};
