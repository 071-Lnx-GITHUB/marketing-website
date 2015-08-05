var fs = require('fs');
module.exports = function includeModals (modals)  {
  var Handlebars = require('handlebars');
  if (modals instanceof Array) {
    var i, content;
    content = '';
    for (i = 0; i < modals.length; i++) {
      content+= fs.readFileSync(__dirname + '/../templates/partials/' + modals[i] + '.hbs', {encoding: 'utf-8'});
    }
    return new Handlebars.SafeString(content);
  }
};
