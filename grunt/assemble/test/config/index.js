var grunt = require('grunt');
var baseConfig = require('../../../_assemble').options;
var configObj = {
  config: {
    guts: 'website-guts',
    content: 'grunt/assemble/test/fixture/website',
    helpers: 'website-guts/helpers'
  },
  link_path: '/dist',
  apiDomain: '',
  sassImagePath: '/dist/assets/img',
  environment: 'dev'
};

grunt.initConfig(configObj);
var config = grunt.config.process(baseConfig);
config.testPath = 'grunt/assemble/test/fixture';

module.exports = config;
