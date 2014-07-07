module.exports.register = function (Handlebars, options, params)  { 
  Handlebars.registerHelper('classgridstart', function (index, options)  { 
    if (index === 0 || index % 3 === 0) {
        return options.fn(this);
    }
    return options.inverse(this);
  });
};