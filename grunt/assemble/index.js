var _ = require('lodash');
var assemble = require('assemble');
var path = require('path');

var addSeoTitle = require('./plugins/seo-title');
var extractLayoutContext = require('./plugins/extract-layout-context');
var sendToSmartling = require('./plugins/smartling');

var generateKey = require('./utils/generate-key');
var normalizeSrc = require('./utils/normalize-src');

// var chalk = require('chalk');
// var ext = require('gulp-extname');
// var langLoader = require('./loaders/subfolders-loader');
// var localizeLinkPath = require('./middleware/localize-link-path');
// var mergeLayoutContext = require('./plugins/merge-layout-context');
// var mergeTranslatedData = require('./middleware/merge-translated-data');
// var resourceListType = require('./plugins/store-resource-list-types');

module.exports = function(grunt) {
  grunt.registerTask('assemble', 'Assemble', function() {
    var done = this.async();

    // Set convenience variables for _assemble.js and import into assemble.
    var config = grunt.config.get('_assemble');
    var options = config.options;
    assemble.set('config', config);

    var load = require('./utils/load')(assemble);
    var renderTypeHelper = require('./helpers/render-type-helper')(assemble);
//     var collectionMiddleware = require('./middleware/onload-collection')(assemble);
//     var push = require('assemble-push')(assemble);

    // TODO: fix this shit
    var omSrc = normalizeSrc(config.om.pages.files).filter(function(src) {
      return (src[0] !== '!');
    });
    
//     var logData = (function() {
//       var lastPath = [];

//       var checkI = function(path) {
//         return !~lastPath.indexOf(path);
//       };

//       return function(fp, type) {
//         console.log('index.js');
//         var key = generateKey(fp);
//         var split = key.split('/');
//         split = split.filter(function(item) {
//           return !!item;
//         });
//         var one = split[0];
//         var two = split[1];
//         var o = {
//           'om-pages': 'magenta',
//           pages: 'blue',
//           partners: 'red',
//           subfolders: 'magenta'
//         };

//         if (options.locales[two]) {
//           if (checkI(two)) {
//             console.log(chalk[ o[type] ].bold('rendering ' + type) + ' => ' + chalk.green(two.toUpperCase()));
//             lastPath.push(two);
//           }
//         }
//         else if (two === 'om' || two === 'partners') {
//           if (checkI(two)) {
//             console.log(chalk[ o[type] ].bold('rendering ') + ' => ' + chalk.green(type));
//             lastPath.push(two);
//           }
//         }
//         else {
//           if (checkI(one)) {
//             console.log(chalk[ o[type] ].bold('rendering ') + ' => ' + chalk.green(type));
//             lastPath.push(one);
//           }
//         }
//       };
//     }());

//     var buildOm = function() {
//       var start = process.hrtime();
//       var files = config[options.ppcKey].files[0];

//       return assemble.src([omSrc])
//         .pipe(extractLayoutContext(assemble))
//         .pipe(mergeLayoutContext())
//         .pipe(addSeoTitle(assemble))
//         .pipe(ext())
//         .pipe(assemble.dest(path.join(files.dest, options.ppcKey)))
//         .on('data', function(file) {
//           logData(file.path, 'om-pages');
//         })
//         .on('end', function() {
//           var end = process.hrtime(start);
//           console.log('finished rendering pages om', end);
//         });
//     };

//     var buildPages = function(reload) {
//       var start = process.hrtime();

//       var files = config.pages.files;
//       var opts = {
//         since: (assemble.get('lastRunTime') ? new Date(assemble.get('lastRunTime')) : null)
//       };

//       //this excludes om pages && resources-list pages
//       return assemble.src(normalizeSrc(files).concat([
//           '!' + omSrc[0],
//           '!website/partners/**/*.hbs'
//         ]), opts)
//         .on('error', function(err) {
//           console.log('src error', err);
//         })
//         .pipe(ext())
//         .pipe(assemble.dest(files.dest))
//         .on('error', function(err) {
//           console.log('dest error', err);
//         })
//         .on('data', function(file) {
//            logData(file.path, 'pages');
//         })
//         .on('end', function() {
//           var end = process.hrtime(start);
//           console.log('finished rendering pages', end);
//           assemble.set('lastRunTime', new Date());
//         });
//     };

//     var buildPartners = function() {
//       var start = process.hrtime();

//       var files = config.partners.files;
//       return assemble.src(normalizeSrc(files))
//         .pipe(ext())
//         .pipe(assemble.dest(path.join(files.dest, 'partners')))
//         .on('data', function(file) {
//            logData(file.path, 'partners');
//         })
//         .on('error', function(err) {
//           console.log('dest error', err);
//         })
//         .on('end', function() {
//           var end = process.hrtime(start);
//           console.log('finished rendering partners', end);
//         });
//     };

//     // ----------------------------------------------------------------------
//     // ----------------------------------------------------------------------

    // Store default rename key for later. It uses the filename minus extension.
    assemble.set('defaultRenameKey', assemble.option('renameKey'));

    // Set rename key to longer format: filepath with no extension.
    assemble.option('renameKey', generateKey);

    // Add custom template types and helpers.
    assemble.helpers(normalizeSrc(config.helpers.files));

    assemble.create('modal', 'modals', {
      isPartial: true,
      isRenderable: true
    });
    assemble.asyncHelper('modal', renderTypeHelper('modals'));

    assemble.create('resource', 'resources', {
      isPartial: true,
      isRenderable: false
    });
    assemble.asyncHelper('partial', renderTypeHelper('partials'));

//     //make more dynamic to get language dirs in an array
//     assemble.create('subfolder', {
//       isRenderable: true
//     }, [langLoader(assemble)]);

//     // custom middleware for `resources` to add front-matter (`data`)
//     // to the assemble cache. (`assemble.get('resources').foo`)
//     assemble.onLoad(/resources-list/, collectionMiddleware('resources'));

//     assemble.onLoad(/partners\/solutions/, collectionMiddleware('solutions'));
//     assemble.onLoad(/partners\/technology/, collectionMiddleware('integrations'));

//     //change the layout name reference to that created in the ppc layout loader
//     var ppcRe = new RegExp(path.join(options.websiteRoot, ppcKey));
//     assemble.onLoad(ppcRe, function(file, next) {
//       file.data.isPpc = true;
//       file.data.layout = ppcKey + '-' + file.data.layout;
//       next();
//     });

//     //merge layout YFM on file context, attach external YML data and translate
//     //order is important here because we want to merge layouts before translating
//     //assemble.preRender(/.*\.(hbs|html)$/, mergeLayoutContext(assemble));
//     assemble.preRender(/.*\.(hbs|html)$/, mergeTranslatedData(assemble));

//     //expose the partners pages takes on the root index partner page
//     //for use in dropdown menu
//     assemble.preRender(/partners\/solutions\/index/, function(file, next) {
//       var col = assemble.get('solutions');
//       var locale = file.data.locale;
//       var langKey = options.locales[locale];
//       var translations = assemble.get('translations');

//       var tags = Object.keys(col).reduce(function(map, key) {
//         var o = col[key];
//         if (_.isArray(o.tags)) {
//           map.push.apply(map, o.tags);
//         }
//         return map;
//       }, []);
//       tags = _.uniq(tags).filter(function(tag) { return !!tag; });

//       file.data.tag_dropdown = tags.reduce(function(map, tag) {
//         var trans, o = {};
//         if (locale && locale !== options.websiteRoot) {
//           trans = translations[langKey][tag];
//         }
//         o.data_tag = tag.toLowerCase();
//         o.tag = trans || tag;
//         map.push(o);

//         return map;
//       }, []);

//       next();
//     });

//     //localize link path after locale is appended in the translate data middleware
//     var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
//     assemble.preRender(pathRe, localizeLinkPath(assemble));

    assemble.task('prep-smartling', function() {
      // var start = process.hrtime();

      // TODO: fix...
      var localesPaths = options.locales.map(function(locale) {
        return path.join(options.localesRoot, locale);
      })
      var allRoots = localesPaths.concat([
        options.websiteRoot,
        options.websiteGuts
      ]);
      var hbsPaths = allRoots.map(function(root) {
        return path.join(root, '**/*.hbs');
      }).concat([
        '!' + options.client,
        '!' + omSrc,
        '!' + normalizeSrc(config.om.layouts.files)
      ]);

      // load up all hbs files and process one by one
      // return assemble.src(hbsPaths, { since: (assemble.get('lastRunTime') ? new Date(assemble.get('lastRunTime')) : null) })
      return assemble.src(hbsPaths)
        .pipe(extractLayoutContext(assemble)) // TODO: optimize
        .pipe(addSeoTitle(assemble)) // TODO: refactor
        .pipe(sendToSmartling(assemble))
        // .on('error', function(err) {
        //   console.log('plugin error', err);
        // })
        // .pipe(resourceListType(assemble))
        // .on('error', function(err) {
        //   console.log('plugin error', err);
        // })
        // .on('end', function() {
        //   var end = process.hrtime(start);
        //   console.log('finished translating pages', end);
        // });
    });

//     assemble.task('om-pages', buildOm);
//     assemble.task('pages', ['prep-smartling'], buildPages);
//     assemble.task('partners', ['prep-smartling'], buildPartners);

//     assemble.task('subfolders', ['partners'],  function() {
//       var start = process.hrtime();
//       var files = config.pages.files[0];

//       /* jshint ignore:start */
//       assemble['subfolder']({
//         src: [
//           '**/*.hbs'
//         ],
//         fallback: [
//           '**/*.hbs',
//           '!resources/resources-list/**/*'
//         ].concat(options.omitFromSubfolders)
//       });
//       /* jshint ignore:end */
//       return push('subfolders')
//       .pipe(ext())
//       .pipe(assemble.dest(files.dest))
//       .on('data', function(file) {
//          logData(file.path, 'subfolders');
//       })
//       .on('error', function(err) {
//         console.log('dest error', err);
//       })
//       .on('end', function() {
//         var end = process.hrtime(start);
//         console.log('finished rendering subfolders', end);
//       });
//     });

//    assemble.task('load', ['resetLastRunTime'], function() {
    assemble.task('load', function() {
      var processYml = require('./plugins/process-yml')(assemble);

      return assemble.src(['website/**/*.yml'])
        .pipe(processYml);


      // // IMPORTANT:
      // // The YML loading functions below require starting with a clean 'data' object.
      // // Run this task before setting properties on 'data' via assemble.set(),
      // // assemble.data(), setting values directly to 'assemble.cache.data', etc.
      // if (!_.isEmpty(assemble.cache.data)) {
      //   throw new Error(
      //     'Must run "load" task with a clean "assemble.cache.data" object.\n' + 
      //     'View comments in /grunt/assemble/index.js for more information.');
      // }

      // // Load external YML to 'assemble.cache.ymlData'
      // load.yml();

      // // load.layouts();
      // // load.modals();
      // // load.partials();
      // // load.resources();

      // // load.omLayouts();
    });

// //    assemble.task('loadOm', loader(loadOmLayouts));
//     assemble.task('loadOm', function() {});

//     assemble.task('rebuild:pages', buildPages);

    // assemble.task('resetLastRunTime', function(cb) {
    //   assemble.set('lastRunTime', null);
    //   cb();
    // });

//     assemble.task('done', ['pages', 'partners', 'subfolders'], done);

//     assemble.task('layouts:pages', ['loadAll', 'prep-smartling'], buildPages);
//     assemble.task('layouts:partners', ['loadAll', 'prep-smartling'], buildPartners);
//     assemble.task('layouts:om', ['loadOm'], buildOm);

//     assemble.task('build:all', ['loadAll', 'om-pages', 'pages', 'partners', 'subfolders']);

//     assemble.task('watch', ['om-pages', 'partners', 'pages'], function() {

//       //only build om if anything om related changes
//       assemble.watch([
//         'website-guts/templates/om/**/*.hbs',
//         'website/om/**/*.hbs'
//       ], ['layouts:om']);

//       //rebuild all pages if layout changes that isn't partners layout
//       //page layout references partners and pages
//       assemble.watch([
//         'website-guts/templates/layouts/**/*.hbs',
//         '!website-guts/templates/layouts/{modal_wrapper,wrapper}.hbs',
//         '!website-guts/templates/layouts/partners.hbs',
//         '!website-guts/templates/layouts/page.hbs',
//         '!website-guts/templates/om/**/*.hbs'
//       ], ['layouts:pages']);

//       assemble.watch([
//         'website/**/global_*.{yml,yaml,json}',
//         'website-guts/templates/layouts/{modal_wrapper,wrapper}.hbs',
//         'website-guts/templates/layouts/page.hbs',
//         'website-guts/templates/{partials,components}/**/*.hbs'
//       ], ['build:all']);

//       //rebuild a single page
//       assemble.watch([
//         'website/**/*.hbs',
//         '!website/partners/**/*.hbs',
//         '!website/om/**/*.hbs'
//       ], ['layouts:pages']);

//       //rebuild all pages and layouts if yml changes
//       assemble.watch([
//         'website/**/*.{yml,yaml,json}',
//         '!website/**/global_*.{yml,yaml,json}',
//         '!website/partners/**/*.{yml,yaml,json}'
//       ], ['layouts:pages']);

//       //rebuild all partners pages if a partners page or partners layout changes
//       assemble.watch([
//         'website/partners/**/*.{hbs,yml,yaml,json}',
//         '!website/partners/**/global_*.{yml,yaml,json}',
//         'website-guts/templates/layouts/partners.hbs'
//       ], ['layouts:partners']);

//     });

    // assemble.task('all', ['load', 'prep-smartling'], done)
    // assemble.run('all');

    assemble.run('load', done);
    // if (options.environment === 'dev') { assemble.run('watch'); }
  });

  return {};
};
