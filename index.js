var cp = require('child_process');
var http = require('http');
var path = require('path');
var express = require('express');
var mkdirp = require('mkdirp');
var async = require('async');

var app = express();
app.configure(function() {
  app.use(express.bodyParser());
  app.use(app.router);
});


app.post('/payload', function(req, res, next) {
  var payload = req.body;
  if (!payload.ref_type || payload.ref_type != 'tag') {
    return res.send(200);
  }
  publish({
    repo: payload.repositry.full_name,
    tag: payload.ref
  }, function(err) {
    if (err) {
      return res.send(500, err, getMessage);
    } else {
      return res.send(200);
    }
  });

});

http.createServer(app).listen(8090, function() {
  console.log('Listening on port 8090');
});

function getHome() {
  var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  return path.join(home, '.pubonpush');
}


function publish(options, cb) {
  var repo = options.repo;
  var tag = options.tag;
  var home = getHome();
  var tempDir = path.join(home, new Date().getTime().toString());

  async.waterfall([

    function mkdir(done) {
      mkdirp(home, done);
    },
    function publish(err, done) {
      var jobPath = path.join(__dirname, './bin/job.sh');
      var command = 'sh ' + jobPath + ' ' + repo + ' ' + tag + ' ' + tempDir;
      console.log(command)
      cp.exec(command,
        function(err, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          done(err);
        });
    }
  ], function(err) {
    return cb(err);
  })
}


// publish({
//   repo: 'cortexjs/PubOnPush',
//   tag: '0.1.3'
// }, function(err) {
//   console.log(err);
// })