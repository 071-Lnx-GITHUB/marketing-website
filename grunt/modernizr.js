/**
 * Parses the files of our project searching for references to Modernizr.
 * Then, it outputs a minified version of the library that includes only the features in use
 */

module.exports = {
  build: {
    devFile: '<%= config.guts %>/assets/js/libraries/modernizr.2.8.3.js',
    files: {
      src: [
        '<%= config.guts %>/assets/css/**/*.scss',
        '<%= config.guts %>/assets/js/**/*.js',
        '!<%= config.guts %>/assets/js/libraries/*.js'
      ]
    },
    outputFile: '<%= config.temp %>/assets/js/libraries/modernizr.2.8.3.min.js',

    extensibility : {
      addtest: true,
      testallprops: true,
      testprops: true,
      teststyles: true
    },

    extra: {
      'cssanimations': true
    },

    matchCommunityTests: true,
    parseFiles: true,
    tests: ['teststyles'],
    uglify: true
  }
};
