var _ = require('lodash');

/**
 * The purpose of this
 * @param obj
 * @returns {*}
 */
module.exports = function fix_html_escape(obj){
  if(_.isArray(obj)){
    _.each(obj, function(value){
      fix_html_escape(value);
    });
  } else if(_.isPlainObject(obj)){
    _.each(obj, function(value, key){
      if(
        (key.indexOf('MD_') === 0 || key.indexOf('HTML_') === 0) &&
        _.isString(obj[key])
      ) {
        obj[key] = obj[key].replace(/{{&gt;/g, '{{>');
      } else {
        fix_html_escape(obj[key]);

      }
    });
  }

  return obj;
};
