var _ = require('lodash');
var generateKey = require('./generate-key');
var normalizeSrc = require('./normalize-src');
var path = require('path');

module.exports = function(assemble) {
  var config = assemble.get('config');
  var options = config.options;

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
  // YML loader
  // ------------------------------------------------------------

  // load YML files from 'website' and 'locales' folders
  var loadYml = function() {
    var src = [
      path.join(options.localesRoot, '**/*.yml'),
      path.join(options.websiteRoot, '**/*.yml')
    ];
    assemble.data(src, { namespace: generateKey });

    var globalYmlData = {};
    var ymlData = {};

    for (var key in assemble.cache.data) {
      var data = assemble.cache.data[key];
      var dirname = path.dirname(key);
      var filename = path.basename(key);
      var prefix = filename.substr(0, 7);

      // if (dirname === localesRootDir && prefix === options.globalYmlFilenamePrefix) {
      //   // global YML file
      //   globalYmlData[filename] = data;
      // }
      // else if (dirname in ymlData) {
      //   // merge multiple files from the same directory
      //   _.assign(ymlData[dirname][options.pageDataNamespace], data);
      // }
      // else {
      //   ymlData[dirname] = {};
      //   ymlData[dirname][options.pageDataNamespace] = data;
      // }
    }

    console.log(globalYmlData);
    console.log(ymlData);

    // assemble.cache.globalYmlData = assemble.cache.globalYmlData || {};
    // assemble.cache.globalYmlData[localeCode] = assemble.cache.globalYmlData[localeCode] || {};

    // assemble.cache.ymlData = assemble.cache.ymlData || {};
    // assemble.cache.ymlData[localeCode] = assemble.cache.ymlData[localeCode] || {};

    // _.assign(assemble.cache.globalYmlData[localeCode], globalYmlData);
    // _.assign(assemble.cache.ymlData[localeCode], ymlData);

    // assemble.cache.data = {};
  };

  // ------------------------------------------------------------
  // Private helpers
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
      options.locales.forEach(function(locale) {
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
    layouts: loadWithDefaultRenameKey(loadLayouts),
    modals: loadWithDefaultRenameKey(loadModals),
    partials: loadWithDefaultRenameKey(loadPartials),
    resources: loadResources,
    yml: loadYml

    // omLayouts: loadWithDefaultRenameKey(loadOmLayouts)
  };
};
