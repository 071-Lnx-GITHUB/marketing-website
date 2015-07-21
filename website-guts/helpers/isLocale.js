module.exports = function (key, options) {
  var locale = this.context.locale;

  if(key === locale) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

