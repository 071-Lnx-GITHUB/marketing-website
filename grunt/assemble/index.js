'use strict';

var ext = require('gulp-extname');
var through = require('through2');
var chalk = require('chalk');
var path = require('path');
var extend = require('extend-shallow');
var createStack = require('layout-stack');
var customSubfolders = require('./types/subfolders');
var _ = require('lodash');

module.exports = function (grunt) {

  grunt.registerTask('assemble', 'Assemble', function (target, target2) {
    var done = this.async();
    var assemble = require('assemble');
    var localizeLinkPath = require('./middleware/localize-link-path');
    var extractLayoutContext = require('./plugins/extract-layout-context');
    var mergeLayoutContext = require('./plugins/merge-layout-context');
    var collectionMiddleware = require('./middleware/onload-collection')(assemble);
    var mergeTranslatedData = require('./middleware/merge-translated-data');
    var resourceListType = require('./plugins/store-resource-list-types');
    var sendToSmartling = require('./plugins/smartling');
    var typeLoader = require('./loaders/type-loader');
    var push = require('assemble-push')(assemble);
    var buildInitialized = false;
    var assembleTasks = [
      'om-pages',
      'prep-smartling',
      'partners',
      'pages',
      'subfolders'
    ];

    var normalizeSrc = function normalizeSrc (cwd, sources) {
      sources = Array.isArray(sources) ? sources : [sources];
      return sources.map(function (src) {
        if (src[0] === '!') {
          return path.join('!' + cwd, src.substring(1));
        }
        return path.join(cwd, src);
      });
    };

    var config = grunt.config.get('_assemble'); // old assemble config
    var options = config.options; // global options
    var omLayouts = path.join(config.om.options.layoutdir, '**/*.hbs');
    var omFiles = config.om.files[0];
    var omSrc = normalizeSrc(omFiles.cwd, omFiles.src).filter(function(src) {
      if(src.indexOf('!') === -1) {
        return true;
      }
    })[0];
    var renderTypeHelper = require('./helpers/render-type-helper')(assemble, options.websiteRoot);
    var generateKey = require('./utils/generate-key');
    var renameKey = assemble.option('renameKey');
    var layoutPath = options.layoutDir.substring(0, options.layoutDir.indexOf('*') - 1);
    var ppcKey = options.ppcKey;

    if(target) {
      assemble.set('env', target);
    } else {
      assemble.set('env', options.environment);
    }

    var globalKeyCache = [];
    //set the global data from external YML & env config
    //special key for YML data for translation dictionary retrieval
    var loadGlobalData = function loadGlobalData() {
      assemble.data(options.data, {
        namespace: function(fp) {
          var filenameKey = path.basename(fp, path.extname(fp));

          if(/global\_/.test(fp)) {
            if(globalKeyCache.indexOf(filenameKey) === -1) {
             globalKeyCache.push(filenameKey);
            }
            return generateKey(fp);
          }
          return filenameKey;
        }
      });
      var data = assemble.get('data');

      for(var key in data) {
        if(globalKeyCache.indexOf(key) !== -1) {
          //remove mutations to global data
          delete data[key];
        }
      }
      //add the additonal data options with the standard key
      var addOptions = _.omit(options, 'data');
      assemble.data(addOptions);
    };



    assemble.asyncHelper('partial', renderTypeHelper('partials'));

    var loader = function loader(typeFn, cb) {
      return function() {
        var currentRenameKey = assemble.option('renameKey');
        assemble.option('renameKey', renameKey);
        if(Array.isArray(typeFn)) {
          typeFn.forEach(function(fn) {
            fn();
          });
        } else {
          typeFn();
        }
        assemble.option('renameKey', currentRenameKey);
        if (cb) {
          cb();
        }
      };
    };

    function loadLayouts () {
      assemble.layouts([options.layoutDir]);
    }

    function loadPartials () {
      assemble.partials(options.partials, [typeLoader(assemble)]);
    }


    function loadOmLayouts () {
      //append special path for ppc layouts in order to prevent naming conflicts between layouts
      assemble.layouts([omLayouts], [function (layouts, options) {
        return Object.keys(layouts).reduce(function (o, key) {
          var layout = layouts[key];
          var concatKey = ppcKey + '-';
          if(layout.data && layout.data.layout) {
            layout.data.layout = concatKey + layout.data.layout;
          }

          o[concatKey + key] = layout;
          return o;
        }, {});
      }]);
    }

    assemble.helpers(options.helpers);

    //load the custom subolders
    customSubfolders(assemble, Object.keys(options.locales), assemble.get('lastRunTime'));

    // create custom template type `modals`
    assemble.create('modal', 'modals', {
      isPartial: true,
      isRenderable: true
    });
    assemble.asyncHelper('modal', renderTypeHelper('modals'));

    // create custom template type `resources`
    assemble.create('resource', 'resources', {
      isPartial: true,
      isRenderable: false,
    });

    var loadModals = function loadModals() {
      var modalFiles = config.modals.files[0];
      assemble.modals(normalizeSrc(modalFiles.cwd, modalFiles.src), [typeLoader(assemble)]);
    };

    var loadResources = function loadResources() {
      var currentRenameKey = assemble.option('renameKey');
      //set rename key to longer format, fp without extension
      assemble.option('renameKey', function(fp) {
        return generateKey(fp);
      });

      var resourceFiles = config.resources.files[0];
      assemble.resources(normalizeSrc(resourceFiles.cwd, resourceFiles.src));

      assemble.option('renameKey', currentRenameKey);
    };

    var loadPageYml = function loadPageYml() {
      assemble.transform('page-translations', require('./transforms/load-translations'), ['**/*.{yml,yaml}', '!**/global_*.{yml,yaml}'], options.websiteRoot);
    };

    var loadSubfolderYml = function loadSubfolderYml() {
      Object.keys(options.locales).forEach(assemble.transform.bind(assemble, 'subfolder-translations', require('./transforms/load-translations'), ['**/*.{yml,yaml}', '!**/global_*.{yml,yaml}']));
    };

    var loadAll = function loadAll(watchRunning) {
      //load the files for the resources collection
      if(watchRunning) {
        loadGlobalData();
        loadResources();
      }

      loader([
        loadLayouts,
        loadPartials,
        loadOmLayouts,
        loadModals
      ])();

      //load external YML files and scope locally, while omitting global YML
      loadPageYml();
      loadSubfolderYml();
    };

    loadGlobalData();

    // custom middleware for `resources` to add front-matter (`data`)
    // to the assemble cache. (`assemble.get('resources').foo`)
    assemble.onLoad(/resources-list/, collectionMiddleware('resources'));
    loadResources();

    assemble.onLoad(/partners\/solutions/, collectionMiddleware('solutions'));
    assemble.onLoad(/partners\/technology/, collectionMiddleware('integrations'));

    //expose the partners pages takes on the root index partner page
    //for use in dropdown menu
    assemble.preRender(/partners\/solutions\/index/, function(file, next) {
      var col = assemble.get('solutions');
      var tags = Object.keys(col).reduce(function(map, key) {
        var o = col[key];
        if(_.isArray(o.tags)) {
          map.push.apply(map, o.tags);
        }
        return map;
      }, []);
      file.data.tags = _.uniq(tags).filter(function(tag) { return !!tag; });
      next();
    });

    //change the layout name reference to that created in the ppc layout loader
    var ppcRe = new RegExp(path.join(options.websiteRoot, ppcKey));
    assemble.onLoad(ppcRe, function(file, next) {
      file.data.isPpc = true;
      file.data.layout = ppcKey + '-' + file.data.layout;
      next();
    });

    //merge layout YFM on file context, attach external YML data and translate
    //order is important here because we want to merge layouts before translating
    //assemble.preRender(/.*\.(hbs|html)$/, mergeLayoutContext(assemble));
    assemble.preRender(/.*\.(hbs|html)$/, mergeTranslatedData(assemble));
    //assemble.preRender(/\/resources\-list\//, function(file, next) {
      //next();
    //});

    //localize link path after locale is appended in the translate data middleware
    var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
    assemble.preRender(pathRe, localizeLinkPath(assemble));

    //set rename key to longer format, fp without extension
    assemble.option('renameKey', function(fp) {
      return path.join(path.dirname(fp), path.basename(fp, path.extname(fp)));
    });

    var localesPaths = Object.keys(options.locales).reduce(function(map, locale) {
      map.push(path.join(options.subfoldersRoot, locale));
      return map;
    }, []);

    var allRoots = localesPaths.concat([
                        options.websiteRoot,
                        options.websiteGuts
                      ]);

    var hbsPaths = allRoots.reduce(function(map, root) {
                          var pattern = '**/*.hbs';
                          map.push(path.join(root, pattern));
                          return map;
                      }, [])
                      .concat([
                        '!' + options.client,
                        '!' + omSrc,
                        '!' + omLayouts
                      ]);

    function logData(fp, type) {
      var key = generateKey(fp);
      var o = {
        'om-pages': 'magenta',
        pages: 'blue',
        partners: 'red',
        subfolders: 'magenta'
      };

      console.log(chalk[ o[type] ].bold('rendered ' + type) + ' => ' + chalk.green(key));
    }

    assemble.task('prep-smartling', function () {
      var start = process.hrtime();

      return assemble.src(hbsPaths, { since: (assemble.get('lastRunTime')?new Date(assemble.get('lastRunTime')):null)})
        .pipe(extractLayoutContext(assemble))
        .pipe(sendToSmartling(assemble))
        .pipe(resourceListType(assemble))
        .on('error', function (err) {
          console.log('plugin error', err);
        })
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished translating pages', end);
        });
    });

    var buildOm = function buildOm() {
        var start = process.hrtime();
        var files = config[ppcKey].files[0];

        return assemble.src([omSrc])
        .pipe(extractLayoutContext(assemble))
        .pipe(mergeLayoutContext())
        .pipe(ext())
        .pipe(assemble.dest(path.join(files.dest, ppcKey)))
        .on('data', function(file) {
          logData(file.path, 'om-pages');
        })
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished rendering pages om', end);
        });
    };

    var ignore = [
      'src',
      'dest',
      'assets',
      'public',
      '_assets'
    ];

    var buildPages = function buildPages (reload) {
        var start = process.hrtime();

        var files = config.pages.files[0];
        var opts = {
          since: (assemble.get('lastRunTime') ? new Date(assemble.get('lastRunTime')) : null)
        };

        //this excludes om pages && resources-list pages
        return assemble.src(normalizeSrc(files.cwd, files.src).concat([
            '!' + omSrc[0],
            '!website/partners/**/*.hbs'
          ]), opts)
          .on('error', function (err) {
            console.log('src error', err);
          })
          .pipe(ext())
          .pipe(assemble.dest(files.dest))
          .on('error', function (err) {
            console.log('dest error', err);
          })
          .on('data', function(file) {
             logData(file.path, 'pages');
             var data = Object.keys(file.data).reduce(function(o, key) {
               if(ignore.indexOf(key) === -1) {
                 o[key] = file.data[key];
               }
               return o;
             }, {});
              //console.log(Object.keys(data).length);
          })
          .on('end', function () {
            var end = process.hrtime(start);
            console.log('finished rendering pages', end);
            assemble.set('lastRunTime', new Date());
            // console.log(assemble.get('data'));
          });
    };

    var buildPartners = function buildPartners() {
        var start = process.hrtime();

        var files = config.partners.files[0];
        return assemble.src(normalizeSrc(files.cwd, files.src))
          .pipe(ext())
          .pipe(assemble.dest(path.join(files.dest, 'partners')))
          .on('data', function(file) {
             logData(file.path, 'partners');
             var data = Object.keys(file.data).reduce(function(o, key) {
                if(ignore.indexOf(key) === -1) {
                  o[key] = file.data[key];
                }
                return o;
             }, {});
             //console.log(Object.keys(data));
          })
          .on('end', function () {
            var end = process.hrtime(start);
            console.log('finished rendering partners', end);
          });
    };

    assemble.task('om-pages', buildOm);
    assemble.task('pages', ['prep-smartling'], buildPages);
    assemble.task('partners', ['prep-smartling'], buildPartners);

    assemble.task('subfolders', ['partners'],  function buildSubfolders() {
      var start = process.hrtime();
      var files = config.pages.files[0];

      /* jshint ignore:start */
      assemble['subfolder']({
        src: [
          '**/*.hbs',
          '!' + omSrc
        ],
        fallback: [ '**/*.hbs', '!resources/resources-list/**/*' ]
      });
      /* jshint ignore:end */
      return push('subfolders')
      .pipe(ext())
      .pipe(assemble.dest(files.dest))
      .on('data', function(file) {
         logData(file.path, 'subfolders');
         var data = Object.keys(file.data).reduce(function(o, key) {
            if(ignore.indexOf(key) === -1) {
              o[key] = file.data[key];
            }
            return o;
         }, {});
      })
      .on('end', function () {
        var end = process.hrtime(start);
        console.log('finished rendering subfolders', end);
      });
    });

    assemble.task('loadAll', ['resetLastRunTime'], function() {
      if(buildInitialized) {
        loadAll(true);
      } else {
        buildInitialized = true;
        loadAll();
      }
    });

    assemble.task('loadOm', loader(loadOmLayouts));
    assemble.task('rebuild:pages', buildPages);

    assemble.task('resetLastRunTime', function (cb) {
      assemble.set('lastRunTime', null);
      cb();
    });

    assemble.task('done', ['pages', 'partners', 'subfolders'], done);

    assemble.task('layouts:pages', ['loadAll', 'prep-smartling'], buildPages);
    assemble.task('layouts:partners', ['loadAll', 'prep-smartling'], buildPartners);
    assemble.task('layouts:om', ['loadOm'], buildOm);
    assemble.task('build:all', ['loadAll', 'om-pages', 'pages', 'partners', 'subfolders']);

    assemble.task('watch', ['om-pages', 'partners', 'pages'], function () {

      //only build om if anything om related changes
      assemble.watch([
        'website-guts/templates/om/**/*.hbs',
        'website/om/**/*.hbs'
      ], ['layouts:om']);

      //rebuild all pages if layout changes that isn't partners layout
      //page layout references partners and pages
      assemble.watch([
        'website-guts/templates/layouts/**/*.hbs',
        '!website-guts/templates/layouts/{modal_wrapper,wrapper}.hbs',
        '!website-guts/templates/layouts/partners.hbs',
        '!website-guts/templates/layouts/page.hbs',
        '!website-guts/templates/om/**/*.hbs'
      ], ['layouts:pages']);

      assemble.watch([
        'website/**/global_*.{yml,yaml,json}',
        'website-guts/templates/layouts/{modal_wrapper,wrapper}.hbs',
        'website-guts/templates/layouts/page.hbs',
        'website-guts/templates/{partials,components}/**/*.hbs'
      ], ['build:all']);

      //rebuild a single page
      assemble.watch([
        'website/**/*.hbs',
        '!website/partners/**/*.hbs',
        '!website/om/**/*.hbs'
      ], ['layouts:pages']);

      //rebuild all pages and layouts if yml changes
      assemble.watch([
        'website/**/*.{yml,yaml,json}',
        '!website/**/global_*.{yml,yaml,json}',
        '!website/partners/**/*.{yml,yaml,json}'
      ], ['layouts:pages']);

      //rebuild all partners pages if a partners page or partners layout changes
      assemble.watch([
        'website/partners/**/*.{hbs,yml,yaml,json}',
        '!website/partners/**/global_*.{yml,yaml,json}',
        'website-guts/templates/layouts/partners.hbs'
      ], ['layouts:partners']);

    });

    var tasks, env = assemble.get('env');

    if(env === 'dev' || env === 'test') {
      tasks = [
        'build:all',
        //'watch',
        'done'
      ];
    } else {
      tasks = [
        'build:all',
        'done'
      ];
    }

    assemble.run(tasks);

  });
  return {};
};
