var path = require('path');
var ppcKey = 'om';

var config = {
  options: {
    assetsDir: '<%= grunt.config.get("assetsDir") %>',
    client: ['<%= config.guts %>/templates/client/**/*.hbs'],
    data: [
      '<%= config.content %>/**/global_*.{yml,yaml,json}',
      '<%= grunt.config.get("environmentData") %>'
    ],
    helpers: ['<%= config.helpers %>/**/*.js'],
    layoutDir: '<%= config.guts %>/templates/layouts/**/*.hbs',
    linkPath: '<%= grunt.config.get("link_path") %>',
    modalsDir: '<%= config.guts %>/templates/components/modals',
    partials: ['<%= config.guts %>/templates/partials/*.hbs'],
    sassImagePath: '<%= grunt.config.get("sassImagePath") %>',

    apiDomain: '<%= grunt.config.get("apiDomain") %>',
    basename: path.basename(process.cwd()),
    environment: '<%= grunt.config.get("environment") %>',
    pageContentNamespace: 'page_data',
    websiteGuts: '<%= config.guts %>',
    websiteRoot: 'website',

    locales: {
      'de': 'de_DE',
      //'fr': 'fr_FR',
      //'es': 'es_ES',
      //'jp': 'ja_JP'
    },
    smartlingConfigs: {
      'dev': 'smartlingConfig_sandbox_pseudo.json',
      'real': 'smartlingConfig_sandbox_real.json',
      'staging': 'smartlingConfig_sandbox_real.json',
      'custom': 'smartlingConfig_custom.json',
      'production': 'smartlingConfig_prod.json',
    },
    subfoldersRoot: 'subfolders',
    tranlatedTypes: [
      'partials',
      'modals'
    ],

    ppcKey: ppcKey,
    omitFromSubfolders: [
      '!404/**/*.hbs',
      '!feature-list/**/*.hbs',
      '!features-and-plans/**/*.hbs',
      '!opticon/**/*.hbs',
      '!' + ppcKey + '/**/*.hbs'
    ]
  },

  modals: {
    files: {
      cwd: '<%= config.guts %>/',
      src: 'templates/components/modals/**/*.hbs'
    },
    options: {
      ext: '.hbs'
    }
  },

  pages: {
    files: {
      cwd: '<%= config.content %>/',
      src: [
        '**/*.hbs',
        '!partners/**/*.hbs',
        '!resources/resources-list/**/*.hbs',
        '!' + ppcKey + '/**/*.hbs'
      ],
      dest: '<%= config.dist %>/'
    }
  },

  partners: {
    files: {
      cwd: '<%= config.content %>/',
      src: 'partners/**/*.hbs',
      dest: '<%= config.dist %>/'
    }
  },

  resources: {
    files: {
      cwd: '<%= config.content %>/',
      src: 'resources/resources-list/**/*.hbs',
      dest: '<%= config.dist %>/'
    }
  }
};

config[ppcKey] = {
  files: {
    cwd: '<%= config.content %>/',
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
