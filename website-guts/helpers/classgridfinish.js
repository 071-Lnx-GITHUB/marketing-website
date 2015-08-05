module.exports = function classgridfinish (index, last, rowCount, options)  {
  if ((index + 1) % rowCount === 0) {
    return options.fn(this);
  }
  else if (last) {
    return options.fn(this);
  }
  return options.inverse(this);
};
