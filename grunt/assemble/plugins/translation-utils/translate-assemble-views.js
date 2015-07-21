var _ = require('lodash');
var path = require('path');

module.exports = function(assemble) {
  var removeTranslationKeys = require('../../utils/remove-translation-keys')(assemble);
  var websiteGuts = assemble.get('data.websiteGuts');
  var locales = assemble.get('data.locales');
  var views = assemble.views;
  var types = assemble.get('data.tranlatedTypes');
  var ignoreKeys = [
    'page_content',
    'seo_title',
    'hbs_extracted'
  ];

  /**
   * Translate objects on the `assemble.views` object in order to translate modals and partials
   *
   * @param {Object} `translated` built translated object with pre-translated type data
   * @return {Object} 'assemble.views` mutates the `assemble.views` object so renderable components are translated accordingly
   */
  return function translateAssembleViews(translated) {
    types.forEach(function(type) {
      var view = views[type];
      if(type === 'modals') {
        type = path.join('components', type);
      }

      _.forEach(view, function(typeData, typeName) {
        var split = typeName.split('_');
        var localePrefix = split.shift();
        var dictKey = locales[localePrefix];
        var typePath, restructuredName, trans;
        /**
         * Filenames associated with the appropriate types are prefixed with a locale key when they are loaded.
         */
        if(dictKey) {
          restructuredName = split.join('_');
          typePath = '/' + path.join(websiteGuts, 'templates', type, restructuredName);
          trans = ( translated[dictKey] && translated[dictKey][typePath] ) || {};
          removeTranslationKeys(typeData.data);
          /**
           * Allow the addition of `HTML_page_content | MD_page_content` for partials and modals
           */
          if(trans.page_content) {
            typeData.content = trans.page_content;
          }

          for(var key in trans) {
            if(ignoreKeys.indexOf(key) === -1) {
              typeData.data[key] = trans[key];
            }
          }
        }

      });

    });

    return views;
  };
};
