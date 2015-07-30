var _ = require('lodash');
var generateKey = require('./generate-key');
var normalizeSrc = require('./normalize-src');
var path = require('path');
var transformPageYaml = require('../transforms/page-yaml');

module.exports = function(assemble) {
  var config = assemble.get('config');

  // ------------------------------------------------------------
  // YAML loaders
  // ------------------------------------------------------------

  // add data from external 'global_' YML files to the Assemble instance
  var loadGlobalYml = function() {
    var src = normalizeSrc(config.globalYml.files);
    assemble.data(src, { namespace: generateKey });
  };

  // load external YML files and scope locally, while omitting global YML
  var loadPageYml = function() {
    assemble.transform(
      'main', // name (not really used for anything)
      transformPageYaml, // function to be called
      '**/*.yml', // file patterns
      config.options.websiteRoot, // cwd
      config.options.globalLocale, // locale
      config.options.pageDataNamespace // namespace
    );
  };

  var loadLocalizedYml = function() {
    config.options.locales.forEach(function(locale) {
      var localePath = path.join(config.options.localesRoot, locale);

      assemble.transform(
        'localized',
        transformPageYaml,
        '**/*.yml',
        localePath,
        locale,
        config.options.pageDataNamespace
      );
    });
  };

  // ------------------------------------------------------------
  // Template loaders
  // ------------------------------------------------------------

  var loadLayouts = function() {
    var src = normalizeSrc(config.layouts.files);
    assemble.layouts(src);
  };

  var loadModals = function() {
    var src = normalizeSrc(config.modals.files);
    assemble.modals(src, [typeLoader]);
  };

  var loadPartials = function() {
    var src = normalizeSrc(config.partials.files);
    assemble.partials(src, [typeLoader]);
  };

  var loadResources = function() {
    var src = normalizeSrc(config.resources.files);
    assemble.resources(src);
  };

// TODO: add om
//   var loadOmLayouts = function() {
//     //append special path for ppc layouts in order to prevent naming conflicts between layouts
//     assemble.layouts([omLayouts], [function(layouts, options) {
//       return Object.keys(layouts).reduce(function(o, key) {
//         var layout = layouts[key];
//         var concatKey = ppcKey + '-';
//         if (layout.data && layout.data.layout) {
//           layout.data.layout = concatKey + layout.data.layout;
//         }

//         o[concatKey + key] = layout;
//         return o;
//       }, {});
//     }]);
//   };

  // ------------------------------------------------------------
  // Private
  // ------------------------------------------------------------

  // some loaders need to use the default renameKey
  var loadWithDefaultRenameKey = function(loader) {
    return function() {
      var currentRenameKey = assemble.option('renameKey');
      var defaultRenameKey = assemble.get('defaultRenameKey');

      assemble.option('renameKey', defaultRenameKey);
      loader();
      assemble.option('renameKey', currentRenameKey);
    }
  };

  // duplicate templates for each locale
  var typeLoader = function(templates) {
    for (var templateKey in templates) {
      config.options.locales.forEach(function(locale) {
        var localeKey = locale + '-' + templateKey;

        templates[localeKey] = {
          data: {
            locale: locale
          }
        };

        _.merge(templates[localeKey], templates[templateKey]);
      });
    }

    return templates;
  };

  return {
    globalYml: loadGlobalYml,
    localizedYml: loadLocalizedYml,
    pageYml: loadPageYml,

    layouts: loadWithDefaultRenameKey(loadLayouts),
    modals: loadWithDefaultRenameKey(loadModals),
    partials: loadWithDefaultRenameKey(loadPartials),
    resources: loadResources

    // omLayouts: loadWithDefaultRenameKey(loadOmLayouts)
  };
};
