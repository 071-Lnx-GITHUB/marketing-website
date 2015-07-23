module.exports = {
  options: {
    environment: '<%= grunt.config.get("environment") %>',
    banner: '<%= grunt.config.get("concat_banner") %>',
    footer: '<%= grunt.config.get("concat_footer") %>',

    root: '<%= grunt.config.get("dist") %>',
    dest: '<%= config.dist %>/assets/js/',

    publicPath: '/assets/js/',
    stats: {
      colors: true,
      modules: true,
      reasons: true
    },

    // add scripts that will be shared between global bundle and page/layout bundles here
    // such as Handlebars, Vue, etc.
    commonVendorScripts: ['handlebars']
  },

  globalBundle: {
    cwd: '<%= config.guts %>/assets/js/',
    src: 'global.js'
  },

  pages: {
    cwd: '<%= config.guts %>/assets/js/',
    src: [
      'layouts/*.js',
      'pages/*.js'
    ]
  }
};
