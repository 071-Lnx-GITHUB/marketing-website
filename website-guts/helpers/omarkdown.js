var marked = require('optimizely-marked');

module.exports = function(options)  {
  marked.setOptions({
    linkPath: this.context.linkPath,
    smartypants: true
  });
  return marked(options.fn(this.context));
};
