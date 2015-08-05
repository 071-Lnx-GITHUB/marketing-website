module.exports = function (urlTest, options)  {
  var reURL = /^(\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)$/;
  var url = urlTest && urlTest.replace('https:', '').replace('http:', '');
  var isValid = url && reURL.test(url);

  if (isValid) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
