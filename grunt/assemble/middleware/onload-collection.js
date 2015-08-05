var _ = require('lodash');
var path = require('path');

module.exports = function(assemble) {
  var removeTranslationKeys = require('../utils/remove-translation-keys.js')(assemble);
  //sets a key on the assemble instance equal to the collection name
  //this object contains keys of the dirname using dirnameKey rename key function
  //and then the collection is accessed in the template using the collection
  //handlebars helper
  return function collectionMiddleware(collection) {

    return function (file, next) {
      if (!file.data[collection]) {
        return next();
      }
      var col = assemble.get(collection) || {};
      var split = file.path.split('/');
      var ext;
      var dirname = split[split.length - 2];
      var basename = split[split.length - 1];
      if (/\.hbs/.test(basename)) {
        ext = '.hbs';
      } else if (/.\html/.test(basename)) {
        ext = '.html';
      }
      if (ext) {
        basename = path.basename(basename, ext);
      }
      var key = path.join(dirname, basename);
      if (col[key]) {
        return next();
      }
      /**
       * add a data_region attribute that will not be translated to work in dropdown menu
       */
      if (file.data.TR_locations) {
        file.data.TR_locations.forEach(function(locationObj) {
          var regionData = locationObj.location.TR_region;
          if (_.isString(regionData)) {
            locationObj.location.data_region = regionData.toLowerCase();
          }
        });
      }
      if (_.isArray(file.data.TR_tags)) {
        file.data.data_tags = file.data.TR_tags.reduce(function(arr, tag) {
          if (_.isString(tag)) {
            arr.push(tag.toLowerCase());
          }
          return arr;
        }, []);
      }
      col[key] = _.merge({}, col[key], file.data);
      removeTranslationKeys(col[key]);
      assemble.set(collection, col);
      next();
    };
  };
};
