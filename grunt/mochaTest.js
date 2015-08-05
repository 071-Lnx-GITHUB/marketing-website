var path = require('path');
var globby = require('globby');

var uiTest = {
  pricing: {
    src: ['test/pricing/*-spec.js']
  },
  dialogs: {
    src: ['test/dialogs/*-spec.js']
  },
  'free-trial': {
    src: ['test/free-trial/*-spec.js']
  },
  'mobile-mvpp': {
    src: ['test/mobile-mvpp/*-spec.js']
  },
  homepage: {
    src: ['test/homepage/*-spec.js']
  },
  'marketing-events': {
    src: ['test/marketing-events/*-spec.js']
  },
  misc: {
    src: ['test/misc/*-spec.js']
   },
  sample: {
    src: ['test/sample/*-spec.js']
   }
};

module.exports = function(grunt, options) {
  var opts;
  if (grunt.option('target')) {
    opts = grunt.option('target');
  }
  var src = Object.keys(uiTest).reduce(function(list, name) {
    if (opts === name || opts === undefined) {
      list.push.apply(list, uiTest[name].src);
    }
    return list;
  }, []);

  var getAssembleSpecs = function() {
    if (opts) {
      return globby.sync(path.join(process.cwd(), 'grunt/assemble/test', opts + '*spec.js'));
    } else {
      return ['grunt/assemble/test/*-spec.js'];
    }
  };

  return {
    options: {
      reporter: 'spec',
      timeout: 40000
    },
    ui: {
      src: src
    },
    assemble: {
      src: getAssembleSpecs()
    },
  };
};
