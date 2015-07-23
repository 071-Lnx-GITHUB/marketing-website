module.exports = {
  css: {
    src: '<%= config.bowerDir %>/magnific-popup/dist/magnific-popup.css',
    dest: '<%= config.dist %>/assets/css/magnific-popup.css'
  },

  img: {
    files: [
      {
        expand: true,
        cwd: '<%= config.guts %>/assets/img/',
        src: '**',
        dest: '<%= config.dist %>/assets/img/'
      },
      {
        src: ['<%= config.guts %>/assets/img/favicon.ico'],
        dest: '<%= config.dist %>/favicon.ico'
      }
    ]
  },

  js: {
    files: [
      {
        expand: true,
        cwd: '<%= config.guts %>/assets/js/om/libraries',
        src: '**',
        dest: '<%= config.dist %>/assets/js/om/libraries/'
      }
    ]
  },

  omUITest: {
    files: [
      {
        src: '<%= config.guts %>/assets/css/om/libraries/qunit-1.17.1.css',
        dest: '<%= config.dist %>/assets/css/qunit-1.17.1.css'
      },
      {
        src: '<%= config.guts %>/assets/js/om/libraries/qunit-1.17.1.js',
        dest: '<%= config.dist %>/assets/js/om/libraries/qunit-1.17.1.js'
      },
      {
        src: '<%= config.guts %>/assets/js/om/test/test.js',
        dest: '<%= config.dist %>/assets/js/om/test/test.js'
      }
    ]
  },

  seo: {
    files: [
      {
        src: ['robots.txt', 'sitemap.xml'],
        dest: '<%= config.dist %>/'
      }
    ]
  }
};
