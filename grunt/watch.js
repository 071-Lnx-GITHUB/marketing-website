module.exports = {

  jsom: {
    files: '<%= config.guts %>/assets/js/om/**/*.js',
    tasks: [
      'config:dev',
      'jshint:clientDev',
      'jshint:server',
      'modernizr',
      'concat:namespaceOMPages',
      'concat:omBundle',
      'concat:jqueryModernizrOM',
      'copy:omUITest',
      'clean:postBuild'
    ]
  },

  sass: {
    files: '<%= config.guts %>/assets/css/**/*.scss',
    tasks: [
      'config:dev',
      'sass:dev',
      'postcss',
      'clean:postBuild'
    ]
  },

  img: {
    files: '<%= config.guts %>/assets/img/*.{png,jpg,svg}',
    tasks: [
      'copy:img'
    ]
  },

  test: {
    files: 'test/**/*.js',
    tasks: [
      'jshint:test',
      'jshint:server'
    ]
  },

  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '<%= config.dist %>/**/*.html',
      '<%= config.dist %>/assets/**/*.{css,js}',
      '!<%= config.dist %>/partners/**/*.html',
      '!bower_components/**/*',
      '!node_modules/**/*'
    ]
  }
};
