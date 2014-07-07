/*
 * Generated on 2014-03-26
 * generator-assemble v0.4.11
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  //jit-grunt loads only the npm tasks required for the grunt task.
  //makes livereload much faster.
  require('jit-grunt')(grunt, {
    replace: 'grunt-text-replace'
  });

  // Project configuration.
  grunt.initConfig({
    config: {
      preview: {
        options: {
          variables: {
            aws: grunt.file.readJSON('configs/s3Config.json'),
            environment: 'preview',
            environmentData: 'website-guts/data/environments/production/environmentVariables.json',
            assets_dir: '/assets',
            sassSourceMap: false,
            sassImagePath: '/assets/img/',
            compress_js: true,
            concat_banner: '(function($){ \n\n' +
                           '  window.optly = window.optly || {}; \n\n' +
                           '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                           '  try { \n\n',
            concat_footer: '  } catch(error){ \n\n' +
                           '  //report errors to GA \n\n' +
                           '  window.console.log("js error: " + error);' +
                           '  } \n' +
                           '})(jQuery);'
          }
        }
      },
      dev: {
        options: {
          variables: {
            environment: 'dev',
            environmentData: 'website-guts/data/environments/development/environmentVariables.json',
            assets_dir: '/dist/assets',
            sassSourceMap: true,
            sassImagePath: '/dist/assets/img/',
            compress_js: false,
            concat_banner: '(function($){ \n\n' +
                           '  window.optly = window.optly || {}; \n\n' +
                           '  window.optly.mrkt = window.optly.mrkt || {}; \n\n',
            concat_footer: '})(jQuery);'
          }
        }
      },
      content: 'website',
      guts: 'website-guts',
      dist: 'dist',
      temp: 'temp',
      helpers: 'helpers',
      bowerDir: 'bower_components'
    },
    watch: {
      assemble: {
        files: [
          '<%= config.content %>/{,*/}*.{md,hbs,yml,json}',
          '<%= config.guts %>/templates/**/*.hbs',
          '<%= config.content %>/**/*.hbs'
        ],
        tasks: ['config:dev', 'assemble']
      },
      sass: {
        files: '<%= config.guts %>/assets/css/**/*.scss',
        tasks: ['config:dev', 'sass', 'replace', 'autoprefixer', 'clean:postBuild']
      },
      img: {
        files: ['<%= config.guts %>/assets/img/*.{png,jpg,svg}'],
        tasks: ['copy:img']
      },
      js: {
        files: ['<%= config.guts %>/assets/js/**/*.js', '<%= config.temp %>/assets/js/**/*.js'],
        tasks: ['config:dev', 'jshint', 'concat', 'uglify', 'clean:postBuild']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/**/*.html',
          '<%= config.dist %>/assets/css/**/*.css',
          '<%= config.dist %>/assets/js/**/*.js'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0',
        middleware: function(connect, options, middlewares){
          middlewares.push(function(req, res, next){
            if(req.url === '/account/free_trial_landing'){

              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end( grunt.file.read('website-guts/endpoint-mocks/formSuccess.json') );

            } else if(req.url === '/account/info') {

              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end( grunt.file.read('website-guts/endpoint-mocks/accountInfo.json') );

            }
            else{

              return next();

            }

          });
          return middlewares;
        }
      },
      livereload: {
        options: {
          open: {
            target: 'http://0.0.0.0:9000/dist',
            base: '.'
          }
        }
      }
    },
    assemble: {
      options: {
        layoutdir: '<%= config.guts %>/templates/layouts/',
        assetsDir: '<%= grunt.config.get("assets_dir") %>',
        environmentIsProduction: '<%= grunt.config.get("environmentIsProduction") %>',
        environmentIsDev: '<%= grunt.config.get("environmentIsDev") %>',
        data: ['<%= config.content %>/**/*.json', '<%= config.content %>/**/*.yml', '<%= grunt.config.get("environmentData") %>'],
        partials: ['<%= config.guts %>/templates/partials/*.{hbs, md}'],
        helpers: ['<%= config.helpers %>/helper-*.js']
      },
      pages: {
        files: [
          {
            src: ['**/*.hbs'],
            dest: '<%= config.dist %>/',
            cwd: '<%= config.content %>/',
            expand: true
          }
        ]
      }
    },
    sass: {
      styles: {
        options: {
          sourceMap: true,
          imagePath: '<%= grunt.config.get("sassImagePath") %>'
        },
        files: [
          {
            src: '<%= config.guts %>/assets/css/styles.scss',
            dest: '<%= config.temp %>/css/styles.css'
          }
        ]
      }
    },
    replace: {
      cssSourceMap: {
        src: '<%= config.temp %>/css/styles.css.map',
        overwrite: true,
        replacements: [
          {
            from: 'website-guts/',
            to: '../../../website-guts/'
          }
        ]
      }
    },
    autoprefixer: {
      options: {
        options: ['last 2 versions', "Firefox ESR"]
      },
      files: {
        flatten: true,
        src: '<%= config.temp %>/css/styles.css',
        dest: '<%= config.dist %>/assets/css/styles.css'
      }
    },
    copy: {
      cssSourceMap: {
        src: '<%= config.temp %>/css/styles.css.map',
        dest: '<%= config.dist %>/assets/css/styles.css.map'
      },
      cssFontFile: {
        src: ['<%= config.guts %>/assets/css/fonts.css'],
        dest: '<%= config.dist %>/assets/css/fonts.css'
      },
      js: {
        files: [
          {
            src: '<%= config.bowerDir %>/jquery/jquery.js',
            dest: '<%= config.dist %>/assets/js/libraries/jquery.js',
            flatten: true,
            filter: 'isFile'
          }
        ]
      },
      img: {
        files: [
          {
            cwd: '<%= config.guts %>/assets/img/',
            src: '**',
            dest: '<%= config.dist %>/assets/img/',
            expand: true
          }
        ]
      }
    },
    clean: {
      preBuild: ['<%= config.dist %>/'],
      postBuild: ['<%= config.temp %>']
    },
    s3: {
      options: {
        key: '<%= grunt.config.get("aws.key") %>',
        secret: '<%= grunt.config.get("aws.secret") %>',
        bucket: '<%= grunt.config.get("aws.bucket") %>',
        access: 'public-read',
      },
      dev: {
        upload: [
          {
            src: '<%= config.dist %>/**/*',
            dest: '/',
            rel: '<%= config.dist %>'
          }
        ]
      }
    },
    jshint: {
      options: {
        trailing: true,
        curly: true,
        eqeqeq: true,
        indent: 4,
        latedef: true,
        noempty: true,
        nonbsp: true,
        undef: true,
        unused: true,
        quotmark: 'single',
        browser: true,
        globals: {
          jQuery: true,
          $: true,
          console: false,
          Handlebars: false,
          moment: false,
          _gaq: false
        },
        '-W087': (function() {
          if(grunt.config.get("environment") == "dev") {
            return true;
          } else {
            return false;
          }
        }())
      },
      files: ['<%= config.guts %>/assets/js/**/*.js', '!<%= config.guts %>/assets/js/libraries/**/*.js']
    },
    concat: {
      modernizrYep: {
        files: {
          '<%= config.dist %>/assets/js/libraries/modernizr-yepnope.js': ['<%= config.guts %>/assets/js/libraries/modernizr-2.8.2.min.js','<%= config.bowerDir %>/yepnope/yepnope.1.5.4-min.js']
        }
      },
      namespace: {
        options: {
          banner: '<%= grunt.config.get("concat_banner") %>',
          footer: '<%= grunt.config.get("concat_footer") %>'
        },
        src: ['**/*.js', '!libraries/**/*.js'],
        expand: true,
        cwd: '<%= config.guts %>/assets/js/',
        dest: '<%= config.dist %>/assets/js/'
      }
    },
    uglify: {
      options: {
        mangle: false,
        compress: false,
        beautify: false
      },
      globalJS: {
        files: {
          '<%= config.dist %>/assets/js/libraries/fastclick.js': ['<%= config.bowerDir %>/fastclick/lib/fastclick.js'],
          '<%= config.dist %>/assets/js/libraries/jquery.js': ['<%= config.dist %>/assets/js/libraries/jquery.js'],
          '<%= config.dist %>/assets/js/bundle.js': [
            '<%= config.bowerDir %>/jquery-cookie/jquery.cookie.js',
            '<%= config.guts %>/assets/js/libraries/handlebars-v1.3.0.js',
            '<%= config.bowerDir %>/momentjs/moment.js',
            '<%= config.guts %>/assets/js/libraries/oForm/oForm.js',
            '<%= config.temp %>/assets/js/global.js'
          ]
        }
      },
      pageFiles: {
        files: [
          {
            expand: true,
            cwd: '<%= config.temp %>/assets/js/pages',
            src: '**/*.js',
            dest: '<%= config.dist %>/assets/js/pages'
          }
        ]
      }
    }
  });

/*
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  //do not load the npm grunt-s3 task when using 'grunt server' per: https://github.com/pifantastic/grunt-s3/issues/68
  //do load it for running 'grunt preview'
  //grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-config');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-text-replace');
*/

  grunt.registerTask('server', [
    'config:dev',
    'jshint',
    'clean:preBuild',
    'assemble',
    'concat',
    'sass',
    'replace',
    'autoprefixer',
    'copy',
    'uglify:globalJS',
    //'clean:postBuild',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'config:dev',
    'jshint',
    'clean:preBuild',
    'assemble',
    'concat',
    'uglify:pageFiles',
    'sass',
    'replace',
    'autoprefixer',
    'copy',
    'clean:postBuild'
  ]);

  grunt.registerTask('preview', [
    'config:preview',
    'jshint',
    'clean:preBuild',
    'assemble',
    'concat',
    'uglify',
    'sass',
    'autoprefixer',
    'copy',
    's3',
    'clean:postBuild'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
