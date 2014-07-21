var http = require('http');
var path = require('path');
var express = require('express');

var app = express();
app.configure(function() {
  app.use(express.bodyParser());
  app.use(app.router);
});


app.post('/payload', function(req,res,next){
  console.log(req.body);
  return res.send(200)
});

http.createServer(app).listen(8090, function() {
  console.log('Listening on port 8090');
});