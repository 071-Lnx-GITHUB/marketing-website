var fs = require('fs');
var UglifyJS = require('uglify-js');

module.exports = function scriptinjector(path, uglify)  {
  if (uglify) {
    return UglifyJS.minify(__dirname + '/' + path).code;
  } else {
    return fs.readFileSync(__dirname + '/' + path, {encoding: 'utf-8'});
  }
};
