module.exports = function formatPercentHeader(value, percentClass) {
  var newHeader,
      startsWithPercent = /^[0-9]{1,3}%/,
      number,
      restOfHeader,
      tildeRe = /\~/g,
      first4 = value.substring(0, 3);

  /**
   * to strip mocked up translations
   */
  if (tildeRe.test(first4)) {
    first4 = first4.replace(tildeRe, '');
    value = first4 + value.substr(3);
  }
  if (startsWithPercent.test(value)) {
    number = value.match(/^[0-9]{1,3}/);
    restOfHeader = value.split('% ')[1];
    newHeader = '<h4 class="customer-title"><span>' + number + '</span><span class="' + percentClass + '"> % </span>' + restOfHeader + '</h4>';
  } else if (/\d+/.test(value)) {
    number = value.match(/\d+/)[0];
    restOfHeader = value.split(number)[1];
    newHeader = '<h4 class="customer-title"><span>' + number + '</span> ' + restOfHeader + '</h4>';
  } else {
    newHeader = '<h4 class="customer-title">' + value + '</h4>';
  }
  return newHeader;
};
