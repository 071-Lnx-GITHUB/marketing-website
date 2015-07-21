var path = require('path');
var ppcKey = 'om';

var config = {
  options: {
    layoutDir: '<%= config.guts %>/templates/layouts/**/*.hbs',
    assetsDir: '<%= grunt.config.get("assetsDir") %>',
    linkPath: '<%= grunt.config.get("link_path") %>',
    apiDomain: '<%= grunt.config.get("apiDomain") %>',
    sassImagePath: '<%= grunt.config.get("sassImagePath") %>',
    environment: '<%= grunt.config.get("environment") %>',
    data: [
      '<%= config.content %>/**/global_*.{yml,yaml,json}',
      '<%= grunt.config.get("environmentData") %>'
    ],
    partials: ['<%= config.guts %>/templates/partials/*.hbs'],
    client: ['<%= config.guts %>/templates/client/**/*.hbs'],
    helpers: ['<%= config.helpers %>/**/*.js'],
    basename: path.basename(process.cwd()),
    websiteRoot: 'website',
    websiteGuts: '<%= config.guts %>',
    modalsDir: '<%= config.guts %>/templates/components/modals',
    pageContentNamespace: 'page_data',
    subfoldersRoot: 'subfolders',
    smartlingConfigs: {
      'dev': 'smartlingConfig_sandbox_pseudo.json',
      'real': 'smartlingConfig_sandbox_real.json',
      'staging': 'smartlingConfig_sandbox_real.json',
      'custom': 'smartlingConfig_custom.json',
      'production': 'smartlingConfig_prod.json',
    },
    locales: {
      'de': 'de_DE',
      //'fr': 'fr_FR',
      //'es': 'es_ES',
      //'jp': 'ja_JP'
    },
    tranlatedTypes: [
      'partials',
      'modals'
    ],
    ppcKey: ppcKey,
    omitFromSubfolders: [
      '!om/**/*.hbs',
      '!opticon/**/*.hbs',
      '!features-and-plans/**/*.hbs',
      '!feature-list/**/*.hbs',
      '!404/**/*.hbs'
    ]
  },
  modals: {
    options: {
      ext: '.hbs'
    },
    files: [
      {
        src: 'templates/components/modals/**/*.hbs',
        cwd: '<%= config.guts %>/'
      }
    ]
  },
  resources: {
    files: [
      {
        src: ['resources/resources-list/**/*.hbs'],
        dest: '<%= config.dist %>/',
        cwd: '<%= config.content %>/'
      }
    ]
  },
  partners: {
    files: [
      {
        src: ['partners/**/*.hbs'],
        dest: '<%= config.dist %>/',
        cwd: '<%= config.content %>/'
      }
    ]
  },
  pages: {
    files: [
      {
        src: ['**/*.hbs', '!resources/resources-list/**/*.hbs', '!om/**/*.hbs'],
        dest: '<%= config.dist %>/',
        cwd: '<%= config.content %>/'
      }
    ]
  }
};

config[ppcKey] = {
  options: {
    layoutdir: '<%= config.guts %>/templates/' + ppcKey + '/layouts/'
  },
  files: [
    {
      src: [ppcKey + '/**/*.hbs', '!<%= grunt.config.get("exclude_from_assemble") %>'],
      dest: '<%= config.dist %>/',
      cwd: '<%= config.content %>/'
    }
  ]
};

module.exports = config;
