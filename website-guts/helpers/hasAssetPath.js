module.exports = function (path, options)  {
  if (path.substring(0, 2) === '//') {
    return options.inverse(this);
  }
  return options.fn(this);
};

