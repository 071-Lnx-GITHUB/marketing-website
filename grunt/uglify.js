module.exports = {
  options: {
    beautify: false,
    compress: {
      drop_console: '<%= grunt.config.get("compress_js") %>'
    },
    mangle: false
  },

  lib: {
    files: [
      {
        expand: true,
        flatten: true,
        src: [
          '<%= config.bowerDir %>/fastclick/lib/fastclick.js',
          '<%= config.guts %>/assets/js/libraries/magnific.js'
        ],
        dest: '<%= config.dist %>/assets/js/libraries/',
        ext: '.min.js',
        extDot: 'first'
      }
    ]
  },
  
  omLib: {
    files: [
      {
        src: '<%= config.dist %>/assets/js/om/bundle.js',
        dest: '<%= config.dist %>/assets/js/om/bundle.js'
      }
    ]
  },

  omLayout: {
    files: [
      {
        expand: true,
        flatten: true,
        cwd: '<%= config.dist %>/assets/js/om/layouts/',
        src: '**/*.js',
        dest: '<%= config.dist %>/assets/js/om/layouts'
      }
    ]
  }
};
