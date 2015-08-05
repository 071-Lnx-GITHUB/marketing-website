/* jshint ignore:start */

var path = require('path');
var _ = require('lodash');
var createStack = require('layout-stack');
var through = require('through2');
var generateKey = require('../utils/generate-key');

module.exports = function(assemble) {
  // transform the layout front matter into an object
  // that `layout-stack` requires
  var mapLayouts = function (layouts) {
    return Object.keys(layouts).reduce(function (acc, key) {
      acc[key] = layouts[key].data;
      return acc;
    }, {});
  };

  // middleware to merge the layout context into the current page context
  return through.obj(function (file, enc, cb) {
    //the layout for the current file
    var layout = file.layout || file.options.layout || file.data.layout;
    // => partners
    //all of the layouts on assemble normalized with a key of layout name
    //value of YAML front matter for layout and SRC and DEST mappings
    var layouts = mapLayouts(assemble.views.layouts);
    // => layout frontmatter

    //stack is an array of layout mappings, i.e. => ['wrapper', 'partners']
    var stack = createStack(layout, layouts, assemble.options);

    var data = {};
    var name = null;
    var page, dict;
    var ignoreKeys = [
      'src',
      'dest',
      'layout'
    ];
    while (name = stack.shift()) {
      //get the dictionary key represented by the file path
      page = generateKey(layouts[name].src.path);
      data[page] = data[page] || {};

      _.forEach(layouts[name], function(val, key) {
        //here swap the keys
        if (ignoreKeys.indexOf(key) === -1) {
          data[page][key] = val;
        }

      });

      if (!Object.keys(data[page]).length) {
        delete data[page];
      }

    }

    if (Object.keys(data).length) {
      file.data.layouts = data;
    }
    this.push(file);
    cb();
  });
};
/* jshint ignore:end */
