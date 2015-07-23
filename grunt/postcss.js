module.exports = {
  options: {
    // map: {
    //   inline: false, // save sourcemaps as separate files
    //   annotation: '<%= config.dist %>/assets/css/maps/' // output directory
    // },
    map: false,
    processors: [
      // https://github.com/ai/browserslist#queries
      require('autoprefixer-core')({
        browsers: ['last 2 versions', 'Firefox ESR']
      })
    ]
  },

  website: {
    flatten: true,
    expand: true,
    src: '<%= config.temp %>/css/*.css',
    dest: '<%= config.dist %>/assets/css/'
  },

  om: {
    flatten: true,
    expand: true,
    src: '<%= config.temp %>/css/om/*.css',
    dest: '<%= config.dist %>/assets/css/om/'
  }
};
