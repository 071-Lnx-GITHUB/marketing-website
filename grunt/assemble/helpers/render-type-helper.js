var _ = require('lodash');

module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');

  return function(type) {
    return function(key, locals, options, next) {
      if (typeof options === 'function') {
        next = options;
        options = locals;
      }

      var app = this.app;
      var locale = this.context.locale || websiteRoot;

      if (locale !== websiteRoot) {
        key = locale + '_' + key;
      }
      var partial = app.views[type][key];

      if (!partial) {
        // TODO: use actual delimiters in messages
        console.error(type + ' {{"' + key + '"}} not found.');
        return next(null, '');
      }

      // TODO: merge vs assign?
      var locs = _.merge({}, this.context, locals);

      partial.render(locs, function (err, content) {
        if (err) {
          return next(err);
        }
        next(null, content);
        return;
      });
    };
  };
};
