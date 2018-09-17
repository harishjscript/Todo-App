'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var expressValidator = require('express-validator');
var app = express();
var server = http.createServer(app);
var port = 8080;
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(expressValidator());

require('./routes')(app);
require('./cron')(app);
app.use(express.static(__dirname + '/app'));
app.get('/', function (req, res) {
  res.redirect('./site/index.html');
});

server.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on port 8080");
  }
});
