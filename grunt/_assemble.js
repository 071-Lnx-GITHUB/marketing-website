var path = require('path');
var ppcKey = 'om';

var config = {
  options: {
    assetsDir: '<%= grunt.config.get("assetsDir") %>',
    client: ['<%= config.guts %>/templates/client/**/*.hbs'],
    linkPath: '<%= grunt.config.get("link_path") %>',
    sassImagePath: '<%= grunt.config.get("sassImagePath") %>',

    apiDomain: '<%= grunt.config.get("apiDomain") %>',
    basename: path.basename(process.cwd()),
    environment: '<%= grunt.config.get("environment") %>',
    pageDataNamespace: 'page_data',
    websiteGuts: '<%= config.guts %>',
    websiteRoot: 'website',

    // locale code for the global US English site
    globalLocale: 'en_US',

    // there is a corresponding folder for each locale in 'localesRoot'
    locales: [
      'de_DE',
      'fr_FR',
      'es_ES',
      'ja_JP'
    ],

    // maps output "subfolder" to source folder in localesRoot
    // (there can be many output folders to source folder)
    // note: source folder must exist in 'locales' above
    localesMap: {
      'de': 'de_DE',
      'fr': 'fr_FR',
      'es': 'es_ES',
      'jp': 'ja_JP'
    },

    // root directory for locales source files
    localesRoot: 'locales',

    // smartlingConfigs: {
    //   'dev': 'smartlingConfig_sandbox_pseudo.json',
    //   'real': 'smartlingConfig_sandbox_real.json',
    //   'staging': 'smartlingConfig_sandbox_real.json',
    //   'custom': 'smartlingConfig_custom.json',
    //   'production': 'smartlingConfig_prod.json',
    // },
    // tranlatedTypes: [
    //   'partials',
    //   'modals'
    // ],

    ppcKey: ppcKey,
    // omitFromSubfolders: [
    //   '!404/**/*.hbs',
    //   '!feature-list/**/*.hbs',
    //   '!features-and-plans/**/*.hbs',
    //   '!opticon/**/*.hbs',
    //   '!' + ppcKey + '/**/*.hbs'
    // ]
  },

  globalYml: {
    files: {
      cwd: '<%= config.content %>',
      src: '**/global_*.yml'
    }
  },

  helpers: {
    files: {
      cwd: '<%= config.helpers %>',
      src: '**/*.js'
    }
  },

  layouts: {
    files: {
      cwd: '<%= config.guts %>',
      src: 'templates/layouts/**/*.hbs'
    }
  },

  modals: {
    files: {
      cwd: '<%= config.guts %>',
      src: 'templates/components/modals/**/*.hbs'
    },
    options: {
      ext: '.hbs'
    }
  },

  pages: {
    files: {
      cwd: '<%= config.content %>',
      src: [
        '**/*.hbs',
        '!partners/**/*.hbs',
        '!resources/resources-list/**/*.hbs',
        '!' + ppcKey + '/**/*.hbs'
      ],
      dest: '<%= config.dist %>/'
    }
  },

  partials: {
    files: {
      cwd: '<%= config.guts %>',
      src: 'templates/partials/*.hbs'
    }
  },

  partners: {
    files: {
      cwd: '<%= config.content %>',
      src: 'partners/**/*.hbs',
      dest: '<%= config.dist %>/'
    }
  },

  resources: {
    files: {
      cwd: '<%= config.content %>',
      src: 'resources/resources-list/**/*.hbs',
      dest: '<%= config.dist %>/'
    }
  }
};

config[ppcKey] = {
  files: {
    cwd: '<%= config.content %>',
    src: [
      ppcKey + '/**/*.hbs',
      '!<%= grunt.config.get("exclude_from_assemble") %>'
    ],
    dest: '<%= config.dist %>/'
  },
  options: {
    layoutdir: '<%= config.guts %>/templates/' + ppcKey + '/layouts/'
  }
};

module.exports = config;
