module.exports = function (key, options) {
  var langKey = this.context.langKey;

  if(key !== langKey) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

