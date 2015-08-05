module.exports = {
  options: {
    trailing: true,
    forin: false,
    strict: false,
    curly: true,
    esnext: true,
    eqeqeq: true,
    indent: 2,
    unused: 'vars',
    latedef: true,
    noempty: true,
    nonbsp: true,
    undef: true,
    quotmark: 'single'
  },
  test: {
    options: {
      browser: true,
      node: true,
      globals: {
        mocha: false,
        it: false,
        console: false,
        describe: false,
        before: false,
        beforeEach: false,
        waits: false,
        waitsFor: false,
        runs: false
      }
    },
    files: {
      src: [
        'test/**/*.js',
        //'grunt/assemble/test/**/*-spec.js',
        'configs/uiTestConfig.js'
      ]
    }
  },
  clientProd: {
    options: {
      browser: true,
      globals: {
        jQuery: false,
        $: false,
        Oform: false,
        w: false,
        d: false,
        Modernizr: true
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
  clientDev: {
    options: {
      browser: true,
      debug: true,
      globals: {
        jQuery: false,
        console: false,
        _gaq: false,
        $: false,
        Oform: false,
        w: false,
        d: false,
        Modernizr: true
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
      node: true,
      debug: true,
      expr: true,
      globals: {
        mocha: false,
        it: false,
        console: false,
        describe: false,
        beforeEach: false,
        before: false,
        waits: false,
        waitsFor: false,
        runs: false
      }
    },
    files: {
      src: [
        '<%= config.guts %>/helpers/*.js',
        'grunt/**/*.js',
        'Gruntfile.js',
        '!grunt/assemble/test/fixture/**/*.js',
        '!grunt/assemble/test/config/**/*.js'
      ]
    }
  }
};
