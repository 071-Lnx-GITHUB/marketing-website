module.exports = {
  options: {
    accessKeyId: '<%= secret.aws_key %>',
    secretAccessKey: '<%= secret.aws_secret %>',
    uploadConcurrency: 50,
    progress: 'progressBar'
  },

  production: {
    options: {
      bucket: '<%= secret.s3_bucket %>'
    },
    expand: true,
    cwd: '<%= config.dist %>/',
    src: '**',
    dest: '/'
  },

  productionClear: {
    options: {
      bucket: '<%= secret.s3_bucket %>',
      differential: true
    },
    action: 'delete',
    cwd: '<%= config.dist %>/',
    dest: '/'
  },

  staging: {
    options: {
      bucket: '<%= secret.s3_bucket %>'
    },
    expand: true,
    cwd: '<%= config.dist %>/',
    src: '**',
    dest: '<%= grunt.option("branch") || gitinfo.local.branch.current.name %>/'
  },

  stagingClear: {
    options: {
      bucket: '<%= secret.s3_bucket %>',
      differential: true
    },
    action: 'delete',
    cwd: '<%= config.dist %>/',
    dest: '<%= grunt.option("branch") || gitinfo.local.branch.current.name %>/'
  }
};
