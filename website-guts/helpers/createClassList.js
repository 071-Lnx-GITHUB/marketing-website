/**
 * Creates a lowercase, concatenated list of classes from a comma separated string or just a string
 * "Foo Bar, Bar Baz, Baz Quz" => "foobar barbaz bazquz "
 * "North / Central America" => "northcentralamerica "
 *
 * @note: adds trailing whitespace
 * @param {string} str
 */
module.exports = function createClassList (str) {
  if (str) {
    var items = str.toLowerCase().split(',');
    var classList = '';
    for (var i = 0; i < items.length; i++) {
      classList += items[i].replace('/', '').replace('&', '').replace(/ /g,'') + ' ';
    }
    return classList;
  } else {
    return;
  }
};
