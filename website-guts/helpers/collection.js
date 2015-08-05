var _ = require('lodash');
var path = require('path');
var generateKey = require('../../grunt/assemble/utils/generate-key');

module.exports = function collection (name, options) {
  //get the collection object off of the assemble instance
  //template the data into the hbs and join the strings
  //sort the collection order by the priority key
  var app = this.app;
  // console.log(this.context);
  var websiteRoot = this.app.get('data.websiteRoot');
  var subfoldersRoot = this.app.get('data.subfoldersRoot');
  var translated = this.app.get('translated');
  var locales = this.app.get('data.locales');
  var locale = this.context.locale;
  var dictKey = locale && locales[locale];
  var col = app.get(name);
  var collectionData = Object.keys(col).map(function (key) {
    var data = col[key];
    var rootKey = generateKey(data.src.path);
    if (locale !== websiteRoot) {
      var dataKey = rootKey.replace('/' + websiteRoot + '/', '/' + path.join(subfoldersRoot, locale) + '/');
      var translations = translated[dictKey] && translated[dictKey][dataKey];
      if (dictKey && translations) {
        _.merge(data, translations);
      }
    }
    data.rootKey = rootKey;

    return data;
  });

  var sortParam, sortBool;

  switch(name) {
    case 'resources':
      sortParam = 'priority';
      sortBool = false;
      break;
    case 'solutions':
      sortParam = 'stars';
      sortBool = false;
      break;
    case 'integrations':
      sortParam = 'title';
      sortBool = true;
      break;
  }

  var html = _.sortByOrder(collectionData, sortParam, sortBool).map(function(data) {
    return options.fn(data);
  }).join('\n');
  return html;
};
