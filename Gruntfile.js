'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  var dateVar = grunt.template.today('dddd, mmmm dS, yyyy, h:MM:ss TT');

  // jit-grunt loads only the npm tasks required for the grunt task.
  // makes livereload much faster.
  require('load-grunt-config')(grunt, {
    jitGrunt: {
      staticMappings: {
        replace: 'grunt-text-replace',
        handlebars: 'grunt-contrib-handlebars',
        resemble: 'grunt-resemble-cli',
        sass: 'grunt-sass',
        connect: 'grunt-contrib-connect',
        assemble: 'grunt/assemble/',
        webpack: 'grunt/webpack/',
        mochaTest: 'grunt-mocha-test',
        open: 'grunt-open'
      }
    },
    data: {
      dateVar: dateVar,
      marketingDistName: 'website-stable'
    },
    init: true
  });

  grunt.registerTask('ui-test', function() {
    // TODO: clean this up
    var tasks = [
      'config:dev',
      'jshint:test'
    ];

    if(!grunt.option('target')) {
      tasks.push('om-test');
    }

    grunt.task.run(tasks.concat(['mochaTest:ui']));
  });

  grunt.registerTask('forceoff', 'Forces the force flag off', function() {
    grunt.option('force', false);
  });

  grunt.registerTask('forceon', 'Forces the force flag on', function() {
    grunt.option('force', true);
  });

  grunt.registerTask('release', 'makes a release to github', function() {
    // Use the forceon option for all tasks that need to continue executing in case of error

    // We need to replace the cloudfront URL on userrevvd when we make a marketing-website release
    // otherwise assets will point to S3 / Cloudfront
    var obj = grunt.config.getRaw('userevvd');
    obj.html.options.formatNewPath = function(path) {
      return path.replace(/^dist/, '');
    };
    obj = { userevvd: obj };
    grunt.config.merge(obj);

    var prepare = ['prompt', 'config:release', 'jshint:clientDev', 'build-deploy'];
    var compress = ['compress'];
    var git_release_tasks = ['gitfetch', 'forceon', 'gittag', 'gitpush', 'forceoff', 'github-release'];

    grunt.task.run(prepare);
    grunt.task.run(compress);
    grunt.task.run(git_release_tasks);
  });
};
