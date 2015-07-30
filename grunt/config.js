module.exports = function(grunt) {

  var getSecretCreds = function(environment) {
    try {
      var filePath = './configs/secret/' + environment + 'Config.json';
      var secret_creds = grunt.file.read(filePath, { encoding: 'utf-8' });
      
      if (secret_creds) {
        secret_creds = JSON.parse(secret_creds);
      }
      return secret_creds;
    }
    catch (err) {
      console.log('error reading secret credentials: ', err);
      return false;
    }
  };

  return {
    options: {
      logOutput: false
    },

    production: {
      options: {
        variables: {
          secret: getSecretCreds('production'),
          environment: 'production',
          apiDomain: '//app.optimizely.com',
          assetsDir: '/dist/assets',
          imageUrl: '/dist/assets/img',
          linkPath: '',
          sassImagePath: '/dist/assets/img',
          compress_js: true,
          drop_console: true,
          exclude_from_assemble: '**/fixture.hbs',
          concat_banner: '(function($, w, d){ \n\n' +
            '  window.optly = window.optly || {}; \n\n' +
            '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
            '  try { \n\n',
          concat_footer: '  } catch(error){ \n\n' +
            '    console.error(error, targetName);\n\n' +
            '    if(typeof error === "object") { try { error = JSON.stringify(error, ["message", "arguments", "type", "name"]); } catch (innerErr) { error = innerErr.message || "cannot parse error message"; } }; \n\n' +
            '    var path = window.location.pathname;\n\n' +
            '    var trimpath = path.lastIndexOf("/") === path.length - 1 && path.length > 1 ? path.substr(0, path.lastIndexOf("/")) : path;\n\n' +
            '    w.analytics.ready(function() { w.analytics.track(trimpath + ": " + targetName, {category: "JavaScript Error", label: error}, { integrations: {"All": false, "Google Analytics": true} }); });\n\n' +
            '  } \n' +
            '})(jQuery, window, document);'
        }
      }
    },

    staging: {
      options: {
        variables: {
          secret: getSecretCreds('staging'),
          environment: 'staging',
          exclude_from_assemble: '',
          apiDomain: '//app.optimizely.com',
          assetsDir: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>/assets',
          linkPath: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>',
          sassImagePath: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>/assets/img',
          imageUrl: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>/assets/img',
          compress_js: true,
          drop_console: false,
          concat_banner: '(function($, w, d){ \n\n' +
            '  window.optly = window.optly || {}; \n\n' +
            '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
            '  try { \n\n',
          concat_footer: '  } catch(error){ \n\n' +
            '    console.error(error, targetName);\n\n' +
            '    if(typeof error === "object") { try { error = JSON.stringify(error, ["message", "arguments", "type", "name"]); } catch (innerErr) { error = innerErr.message || "cannot parse error message"; } }; \n\n' +
            '    var path = window.location.pathname;\n\n' +
            '    var trimpath = path.lastIndexOf("/") === path.length - 1 && path.length > 1 ? path.substr(0, path.lastIndexOf("/")) : path;\n\n' +
            '    w.analytics.ready(function() { w.analytics.track(trimpath + ": " + targetName, {category: "JavaScript Error", label: error}, { integrations: {"All": false, "Google Analytics": true} }); });\n\n' +
            '  } \n' +
            '})(jQuery, window, document);'
        }
      }
    },

    dev: {
      options: {
        variables: {
          environment: 'dev',
          exclude_from_assemble: '',
          apiDomain: '',
          assetsDir: '/dist/assets',
          linkPath: '/dist',
          sassSourceMap: true,
          sassImagePath: '/dist/assets/img',
          imageUrl: '/dist/assets/img',
          compress_js: false,
          drop_console: false,
          concat_banner: '(function($, w, d){ \n\n' +
                         '  window.optly = window.optly || {}; \n\n' +
                         '  window.optly.mrkt = window.optly.mrkt || {}; \n\n',
          concat_footer: '})(jQuery, window, document);'
        }
      }
    },

    release: {
      options: {
        variables: {
          environment: 'staging',
          exclude_from_assemble: '',
          apiDomain: '//app.optimizely.test',
          assetsDir: '/dist/assets',
          linkPath: '',
          sassImagePath: '/dist/assets/img',
          imageUrl: '/dist/assets/img',
          compress_js: true,
          drop_console: false,
          concat_banner: '(function($, w, d){ \n\n' +
            '  window.optly = window.optly || {}; \n\n' +
            '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
            '  try { \n\n',
          concat_footer: '  } catch(error){ \n\n' +
            '    console.error(error, targetName);\n\n' +
            '    if(typeof error === "object") { try { error = JSON.stringify(error, ["message", "arguments", "type", "name"]); } catch (innerErr) { error = innerErr.message || "cannot parse error message"; } }; \n\n' +
            '    var path = window.location.pathname;\n\n' +
            '    var trimpath = path.lastIndexOf("/") === path.length - 1 && path.length > 1 ? path.substr(0, path.lastIndexOf("/")) : path;\n\n' +
            '    w.analytics.ready(function() { w.analytics.track(trimpath + ": " + targetName, {category: "JavaScript Error", label: error}, { integrations: {"All": false, "Google Analytics": true} }); });\n\n' +
            '  } \n' +
            '})(jQuery, window, document);'
        }
      }
    },

    content: 'website',
    guts: 'website-guts',
    dist: 'dist',
    temp: 'temp',
    helpers: 'website-guts/helpers',
    bowerDir: 'bower_components',
  };

};
