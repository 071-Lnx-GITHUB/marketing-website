var checkComplexPassword = function(password) {
  var CHAR_LOWERS = /[a-z]/,
    CHAR_UPPERS   = /[A-Z]/,
    CHAR_NUMBERS  = /[0-9]/,
    CHAR_SPECIAL  = /[?=.*!@#$%^&*]/,
    CHAR_TYPES    = [CHAR_LOWERS,CHAR_UPPERS,CHAR_NUMBERS,CHAR_SPECIAL],
    counter       = 4;

  for (var i=0; i<CHAR_TYPES.length; i++){
    if(!CHAR_TYPES[i].test(password)){
      counter--;
    }
  }

  if (counter <= 1 || password.length < 8){
    return false;
  } else {
    return true;
  }
};

module.exports = function(grunt, options) {

  if(grunt.option('env') !== 'production'){

    var bodyParser = require('body-parser');

  }

  return {
    options: {
      port: 9000,
      livereload: 35729,
      // change this to '0.0.0.0' to access the server from outside
      hostname: 'localhost',
      middleware: function(connect, options, middlewares){
        return [
            connect().use(bodyParser.urlencoded({extended: true})),

            connect.static(options.base[0]),

            function(req, res, next){
              var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                respObj,
                code;
              var readPath;

              if(req.method === 'POST'){

                if(req.url === '/pricing/change_plan'){

                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end( grunt.file.read('website-guts/endpoint-mocks/general-success.json') );

                } else if(req.url === '/pricing/contact_sales') {

                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end( grunt.file.read('website-guts/endpoint-mocks/contactSales.json') );

                } else if(req.url === '/contact/form'){

                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end( grunt.file.read('website-guts/endpoint-mocks/contactSuccess.json') );

                } else if(req.url === '/webinar/register'){

                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end( grunt.file.read('website-guts/endpoint-mocks/webinarSuccess.json') );

                } else if(req.url === '/webinar/register-fail'){

                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end( grunt.file.read('website-guts/endpoint-mocks/webinarFail.json') );

                } else if(req.url === '/account/free_trial_create'){

                  if(req.body.email === 'david.fox-powell@optimizely.com') {
                    respObj = '{"id":"9b96c818-b116-40f8-9a30-e08ef7dae4a4","succeeded":false,"error":"Account already exists."}';
                    code = 400;
                  } else {
                    respObj = grunt.file.read('website-guts/endpoint-mocks/free-trial-success.json');
                    code = 200;
                  }

                  setTimeout(function(){
                    res.writeHead(code, {'Content-Type': 'application/json'});
                    res.end( respObj );
                  }, 2000);

                } else if(req.url === '/account/free_trial_landing/account_exists'){

                  res.writeHead(400, {'Content-Type': 'application/json'});
                  res.end( grunt.file.read('website-guts/endpoint-mocks/accountExists.json') );

                } else if(req.url === '/account/create') {
                    if(req.body.email !== 'david.fox-powell@optimizely.com') {
                      res.cookie('optimizely_signed_in', '1', {httpOnly: false});
                      res.writeHead(200, {'Content-Type': 'application/json'});
                      res.end( grunt.file.read('website-guts/endpoint-mocks/createAccount.json') );
                    } else {
                      res.writeHead(400, {'Content-Type': 'application/json'});
                      res.end( grunt.file.read('website-guts/endpoint-mocks/accountExists.json') );
                    }
                } else if(req.url === '/account/signin') {
                  if(emailRegEx.test(req.body.email) && checkComplexPassword(req.body.password)) {
                    readPath = 'website-guts/endpoint-mocks/accountInfo.json';
                    code = 200;
                    res.cookie('optimizely_signed_in', '1', {httpOnly: false});
                  } else {
                    readPath = 'website-guts/endpoint-mocks/invalidSignin.json';
                    code = 400;
                  }
                  res.writeHead(code, {'Content-Type': 'application/json'});
                  setTimeout(function() {
                    res.end(grunt.file.read(readPath));
                  }, 2000);

                } else if(req.url === '/recover/request') {

                  if(req.body.email === 'david.fox-powell@optimizely.com') {
                    respObj = '{"message":"Email sent.","succeeded":true}';
                    code = 200;
                  } else {
                    respObj = '{"id":"18137fdc-1e90-45a7-bf91-50c5a69c59e6","succeeded":false,"error":"Account was not found."}';
                    code = 400;
                  }
                  res.writeHead(code, {'Content-Type': 'application/json'});
                  setTimeout(function() {
                    res.end(respObj);
                  }, 2000);


                } else {

                  return next();

                }

              } else if(req.url === '/account/info') {
                var paths = [
                  'website-guts/endpoint-mocks/accountInfo.json',
                  'website-guts/endpoint-mocks/nullAccountInfo.json'
                ];

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end( grunt.file.read(paths[0]) );

              } else if(req.url === '/account/signout') {

                  res.cookie('optimizely_signed_in', '', {maxAge: 0, expires: new Date(Date.now() - 500000000), httpOnly: false});
                  res.cookie('optimizely_signed_in', '', {maxAge: 0, expires: new Date(Date.now() - 500000000), httpOnly: false});
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end('{"success": "true"}');

              } else if(req.url === '/api/jobs/details.json') {

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end( grunt.file.read('website-guts/endpoint-mocks/jobscoreData.json') );

              } else{

                return next();

            }

          }

        ];

      }
    },
    livereload: {
      options: {
        open: {
          target: 'http://localhost:9000/dist',
          base: '.'
        }
      }
    },
    resemble: {
      options: {
         port: '9000',
         hostname: 'localhost'
      }
    },
    keepalive: {
      options: {
        open: {
          target: 'http://localhost:9000',
        },
        base: 'dist',
        keepalive: true
      }
    }
  };
};
