module.exports = function is_even (index, options)  {
  if (index % 2 === 0) {
    return options.fn(this);
  }
  return options.inverse(this);
};
