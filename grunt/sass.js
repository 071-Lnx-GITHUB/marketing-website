var path = require('path');
var sass = require('grunt-sass/node_modules/node-sass');

module.exports = function(grunt) {
  var files = [
    {
      src: '<%= config.guts %>/assets/css/styles.scss',
      dest: '<%= config.temp %>/css/styles.css'
    },
    {
      src: '<%= config.guts %>/assets/css/om/styles.scss',
      dest: '<%= config.temp %>/css/om/styles.css'
    }
  ];

  var imageUrl = function(filename) {
    var imageUrl = grunt.config.get('imageUrl');
    var fileName = filename.getValue();

    var imagePath = 'url("' + imageUrl + '/' + fileName + '")';
    return new sass.types.String(imagePath);
  };

  return {
    options: {
      functions: {
        'image-url($filename)': imageUrl
      },
      imagePath: '<%= grunt.config.get("sassImagePath") %>',
      includePaths: [
        path.join(process.cwd(), 'node_modules/css-smart-grid/sass'),
        require('optimizely-lego').includePath
      ],
      precision: 3
    },

    dev: {
      files: files,
      options: {
        sourceMap: false // TODO: enable
      }
    },

    prod: {
      files: files,
      options: {
        sourceMap: false,
        outputStyle: 'compressed'
      }
    }
  };
};
