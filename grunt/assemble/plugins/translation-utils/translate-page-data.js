var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var fixHTMLEscape = require('./fix-html-escape');
var curryTryCatch = require('../../utils/curry-try-catch');

module.exports = function(assemble){
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var lang = assemble.get('lang');
  var parseFilePath = require('../../utils/parse-file-path')(assemble);
  var subfolderTempData = curryTryCatch(require('./get-subfolder-template-data'))(assemble);


  /**
   * Function for iterating the completed pageData object and performing translations appropriately
   * Also, uses the layouts array to find associate layouts and translate (TODO: hack because performing this earlier was breaking Assemble silently)
   *
   * case 1: locale specific file is in the dictionary so use it
   * case 2: file is inherited from the root website so must use a parent key in the dictionary to translate
   * case 3: fp is a special type (layout|partial|modal)
   *
   * @param {String} `locale` function to be wrapped in try/catch
   * @param {Object} `lang` all parsed translation key/val
   * @param {Object} 'pageDataClone' the `pageDataClone` object
   * @param {Object} `translations` the translation dictionary returned from smartlingUpload
   * @return {Object} Mutates the `pageDataClone` object
   *
   */
  return function translatePageData(locale, pageDataClone, translations) {
    var dictKey = locales[locale];
    var dict = translations[dictKey];
    var hasOwnTemplate = subfolderTempData.hasOwnTemplate;

    _.forEach(pageDataClone[locale], function(val, fp) {
      var filePathData = parseFilePath(fp);
      var parentPath = fp.replace(path.join(subfoldersRoot, locale), websiteRoot);
      var layoutPaths = pageDataClone[locale][fp].layouts;
      var yml, parentLang, childLang, trans;
      //must first remove the layouts to avoid double translation
      if(layoutPaths) {
        delete pageDataClone[locale][fp].layouts;
      }

      if(!filePathData.isSubfolder) {
        /**
         * Takes into account translations for special types(layouts|partials|modals)
         */
        yml = _.cloneDeep(lang[filePathData.locale][fp]);
      } else {
        //must account for if hbs template exists in subfolder, do not want to inherit
        parentLang = lang[websiteRoot] && lang[websiteRoot][parentPath];
        childLang = lang[locale] && lang[locale][fp];

        if(hasOwnTemplate.indexOf(fp) !== -1) {
          yml = _.cloneDeep(childLang);
        } else {
          //order is important because child keys must overwrite parent
          yml = _.merge({}, parentLang, childLang);
        }

        if(layoutPaths) {
          pageDataClone[locale][fp].layouts = pageDataClone[locale][fp].layouts || {};

          _.forEach(layoutPaths, function(layoutData, layoutPath) {
            var langData = lang.layouts[layoutPath];

            //only translate data from lang dictionary to avoid translating matching phrases not intedend for translation
            objParser.translate(langData, dict);
            fixHTMLEscape(langData);
            _.merge(layoutData, langData);

            if(layoutData.TR_hbs_extracted) {
              delete layoutData.TR_hbs_extracted;
            }

            //TODO: probably a better way to do this => recreate the layouts object
            pageDataClone[locale][fp].layouts[layoutPath] = layoutData;

          });
        }

      }

      if(yml.TR_hbs_extracted) {
        delete yml.TR_hbs_extracted;
      }
      trans = objParser.translate(yml, dict);
      fixHTMLEscape(trans);
      _.merge(pageDataClone[locale][fp], trans);
    });

    return pageDataClone;
  };
};
