var phantomPath = require('phantomjs').path;
var createQueryString = function(params) {
  var queryString = '';
  if (params) {
    for (var key in params) {
      queryString += ('&' + key + '=' + params[key]);
    }
  }
  return queryString;
};

module.exports = function(options) {
  var cachedPath;

  return {
    basePath: function(opts) {
      var queryString = createQueryString(opts.queryParams);
      if (!cachedPath) {
        if (global.branchPath) {
          global.branchPath = global.branchPath[0] === '/' ? global.branchPath.substr(1) : global.branchPath;
          if (global.branchPath.lastIndexOf('/') === global.branchPath.length -1) {
            global.branchPath = global.branchPath.substring(0, global.branchPath.length - 1);
          }

          cachedPath = 'https://www.optimizelystaging.com/' + global.branchPath + opts.path + '?uiTest=true';
        } else {
          cachedPath = 'http://localhost:9000' + '/dist' + opts.path + '?uiTest=true';
        }
      }
      return  cachedPath + queryString;
    },
    firstName: 'David',
    lastName: 'Fox test',
    company: 'Optimizely',
    title: 'Frontend engineer',
    phone: '5555555555',
    website: 'https://www.optimizely.com',
    email: 'testing@optimizely.com',
    retrievePasswordEmail: 'david.fox-powell@optimizely.com',
    password: '1800EatBurritos',
    phantomPath: phantomPath.substring(0, phantomPath.lastIndexOf('/') + 1),
    screenshot: function(opts) {
      return options.dirname + '/screenshots/' + opts.imgName + '.jpg';
    },
    formSuccessElm: function(opts) {
      return 'body[data-form-success="' + opts.formAction + '"]';
    }
  };
};
