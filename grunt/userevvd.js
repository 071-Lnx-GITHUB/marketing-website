module.exports = {
  options: {
    formatOriginalPath: function(path) {
      return '/' + path;
    },
    formatNewPath: function(path) {
      return path.replace(/^dist/, '');
    }
  },
  html: {
    files: [
      {
        expand: true,
        cwd: '<%= config.dist %>/',
        src: '**/*.html',
        dest: '<%= config.dist %>'
      }
    ]
  },
  css: {
    files: [
      {
        expand: true,
        cwd: '<%= config.dist %>/',
        src: '**/*.css',
        dest: '<%= config.dist %>'
      }
    ]
  }
};
