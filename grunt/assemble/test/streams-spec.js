'use strict';

var assemble = require('assemble');
var smartling = require('../plugins/smartling');
var instance = null;

describe('streams', function () {
  beforeEach(function () {
    instance = assemble.init();
  });

  it('should stream', function (done) {
    instance.src(['./fixture/website/**/*.hbs'])
      .pipe(smartling(instance))
      .on('error', done)
      .on('data', function (data) {
        console.log(data);
      })
      .on('end', function () {
        done();
      });
  });
});
