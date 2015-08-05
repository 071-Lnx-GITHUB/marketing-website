module.exports = {
  main: {
    options: {
      archive: 'temp/<%= marketingDistName %>.tar.gz' // What you want to call your file
    },
    files: [
      {
        src: ['dist/**'], // What should be included in the zip
        dest: ''
      },
    ]
  }
};
