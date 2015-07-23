module.exports = {
  // http://jshint.com/docs/options/
  options: {
    curly: true,
    eqeqeq: true,
    esnext: true,
    forin: false,
    latedef: true,
    nonbsp: true,
    quotmark: 'single',
    strict: false,
    undef: true,
    unused: 'vars' // TODO: 'strict'
  },

  test: {
    options: {
      browser: true,
      globals: {
        before: false,
        beforeEach: false,
        console: false,
        describe: false,
        it: false,
        mocha: false,
        runs: false,
        waits: false,
        waitsFor: false
      },
      node: true
    },
    files: {
      src: [
        'test/**/*.js',
        //'grunt/assemble/test/**/*-spec.js',
        'configs/uiTestConfig.js'
      ]
    }
  },

  // TODO: get this to pass?
  clientProd: {
    options: {
      browser: true,
      globals: {
        $: false,
        d: false,
        jQuery: false,
        Modernizr: true,
        Oform: false,
        w: false
      }
    },
    files: {
      src: [
        '<%= config.guts %>/assets/js/**/*.js',
        '!<%= config.guts %>/assets/js{,/om}/libraries/**/*.js',
        '!<%= config.guts %>/assets/js{,/om}/utils/*.js'
      ]
    }
  },

  // TODO: get this to pass?
  clientDev: {
    options: {
      browser: true,
      debug: true,
      globals: {
        _gaq: false,
        $: false,
        console: false,
        d: false,
        jQuery: false,
        Modernizr: true,
        Oform: false,
        w: false
      }
    },
    files: {
      src: [
        '<%= config.guts %>/assets/js/**/*.js',
        '!<%= config.guts %>/assets/js{,/om}/libraries/**/*.js',
        '!<%= config.guts %>/assets/js{,/om}/utils/*.js'
      ]
    }
  },

  server: {
    options: {
      debug: true,
      expr: true,
      node: true,
      globals: {
        before: false,
        beforeEach: false,
        console: false,
        describe: false,
        it: false,
        mocha: false,
        runs: false,
        waits: false,
        waitsFor: false
      }
    },
    files: {
      src: [
        'Gruntfile.js',
        'grunt/**/*.js',
        '<%= config.guts %>/helpers/*.js',
        '!grunt/assemble/test/config/**/*.js',
        '!grunt/assemble/test/fixture/**/*.js'
      ]
    }
  }
};
