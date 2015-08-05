var _ = require('lodash');

module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');

  /**
   * Function for iterating the completed pageData object and adding layout data to the file.data
   *
   * @param {Object} `pageDataClone` object representing the map of page data
   * @return {Object} Mutates the `pageDataClone` object and replaces layout data array with layout file paths
   */
  return function mergeLayoutData(pageDataClone) {
    var typeData = pageDataClone[websiteRoot];
    _.forEach(typeData, function(fileData, fp) {
      var layoutKeys = Object.keys(fileData.layouts || {});
      if (layoutKeys.length) {
        var layoutData = layoutKeys.reduce(function(memo, key) {
          _.merge(memo, fileData.layouts[key]);
          return memo;
        }, {});
        //merge the layout data onto the pageDataClone file data
        _.merge(fileData, layoutData);
      }
      //store the layout file paths in an array
      fileData.layouts = layoutKeys;
    });
    return pageDataClone;
  };
};
