var path = require('path');
var sass = require('grunt-sass/node_modules/node-sass');

module.exports = function(grunt) {
  return {
    options: {
      includePaths: [
        path.join(process.cwd(), 'node_modules/css-smart-grid/sass'),
        require('optimizely-lego').includePath
      ],
      functions: {
        'image-url($filename)': function(filename) {
          var imageUrl = grunt.config.get('imageUrl');
          var fileName = filename.getValue();

          var imagePath = 'url("' + imageUrl + '/' + fileName + '")';
          return new sass.types.String(imagePath);
        }
      }
    },
    prod: {
      options: {
        sourceMap: false,
        imagePath: '<%= grunt.config.get("sassImagePath") %>',
        precision: 3,
        outputStyle: 'compressed',
      },
      files: [
        {
        src: '<%= config.guts %>/assets/css/styles.scss',
        dest: '<%= config.temp %>/css/styles.css'
      },
      {
        src: '<%= config.guts %>/assets/css/om/styles.scss',
        dest: '<%= config.temp %>/css/om/styles.css'
      }
      ]
    },
    dev: {
      options: {
        sourceMap: false,
        imagePath: '<%= grunt.config.get("sassImagePath") %>',
        precision: 3,
      },
      files: [
        {
        src: '<%= config.guts %>/assets/css/styles.scss',
        dest: '<%= config.temp %>/css/styles.css'
      },
      {
        src: '<%= config.guts %>/assets/css/om/styles.scss',
        dest: '<%= config.temp %>/css/om/styles.css'
      }
      ]
    }

  };
};
