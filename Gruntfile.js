'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  var dateVar = grunt.template.today('dddd, mmmm dS, yyyy, h:MM:ss TT');

  // jit-grunt loads only the npm tasks required for the grunt task. (makes livereload much faster.)
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

  grunt.registerTask('om-test', ['open']);
  grunt.loadNpmTasks('grunt-aws');
  grunt.registerTask('production-deploy', [
    'gitinfo',
    'config:production',
    'clean:preBuild',
    'jshint:server',
    'assemble',
    'modernizr',
    'concat',
    'webpack',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    'filerev',
    'userevvd',
    'aws_s3:productionClear',
    'aws_s3:production',
    'clean:postBuild',
    'fastly:production'
  ]);

  grunt.registerTask('staging-deploy', [
    'gitinfo',
    'config:staging',
    'clean:preBuild',
    'jshint:server',
    'assemble',
    'modernizr',
    'concat',
    'webpack',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    'aws_s3:stagingClear',
    'aws_s3:staging',
    'clean:postBuild',
    'fastly:staging'
  ]);

  grunt.registerTask('smartling-staging-deploy', [
    'gitinfo',
    'config:smartlingStaging',
    'clean:preBuild',
    'jshint:server',
    'assemble:smartling-staging-deploy',
    'modernizr',
    'concat',
    'webpack',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    'aws_s3:smartling',
    'clean:postBuild'
  ]);

  var serverTasks = [
    'config:dev',
    'jshint:test',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'modernizr',
    'concat',
    'webpack',
    'sass:dev',
    'replace',
    'autoprefixer',
    'copy',
    'clean:postBuild',
    'connect:livereload',
    'watch'
  ];

  grunt.registerTask('server', function(which) {
    var cachedI;
    var assembleTask = serverTasks.filter(function(task, i) {
      if (/assemble/.test(task)) {
        cachedI = i;
        return true;
      }
    })[0];
    if (which) {
      assembleTask += (':' + which);
      serverTasks[cachedI] = assembleTask;
    }
    grunt.task.run(serverTasks);
  });

  grunt.registerTask('build', [
    'config:production',
    'clean:preBuild',
    'jshint:server',
    'assemble',
    'modernizr',
    'concat',
    'webpack',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    'filerev',
    'userevvd',
    'clean:postBuild'
  ]);

  grunt.registerTask('build-release', [
    'gitinfo',
    'config:release',
    'jshint:clientDev',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'modernizr',
    'concat',
    'webpack',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    'filerev',
    'userevvd',
    'clean:postBuild'
  ]);

  grunt.registerTask('ui-test', function(which) {
    var tasks = [
      'config:dev',
      'jshint:test',
    ];
    if (!grunt.option('target')) {
      tasks.push('om-test');
    }
    grunt.task.run(tasks.concat(['mochaTest:ui']));
  });

  grunt.registerTask('test', [
    'config:dev',
    'jshint:test',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'modernizr',
    'concat',
    'webpack',
    'sass:dev',
    'replace',
    'autoprefixer',
    'copy',
    'clean:postBuild',
    'connect:resemble',
    'om-test',
    'mochaTest',
  ]);

  grunt.registerTask('default', ['build']);
  grunt.loadNpmTasks('grunt-github-releaser');
  grunt.loadNpmTasks('grunt-git');

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

    var prepare = ['prompt', 'build-release'];
    var compress = ['compress'];
    var git_release_tasks = ['gitfetch', 'forceon', 'gittag', 'gitpush', 'forceoff', 'github-release'];

    grunt.task.run(prepare);
    grunt.task.run(compress);
    grunt.task.run(git_release_tasks);
  });
};
