var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var http = require('http'),
  https = require('https');
http.globalAgent.maxSockets = 100;
https.globalAgent.maxSockets = 100;

var app = express();

var cors = require('cors');

if (process.env.NODE_ENV !== 'production')
  require('./webpack')(app);

//TODO For testing remove later
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'some!!@@secret123';
process.env.PRIME = 'eca59a04b80707d8bf72739b9e97f0692ef5614c83128e520348aa3cd81c1e3b';
process.env.PUBLIC_KEY = "8658dddffbb10bf4ad762957205573d2335f18a9eea4f11a39cd7e5d5b971a56";
process.env.PRIVATE_KEY = "7cc13f49ad8737a8899b2eabbdb45f305169c984c0925c57f13410f04c4b97be";
process.env.JWT_SECRET = 'a2a30bd6fc5f44c1b30439db8b7ef0833effda2e505fbed65e96e889919f1813';

// view engine setup
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(cors({ credentials: true, origin: true }));

app.use('/', require('./routes/api'));
app.use('/', require('./routes/app'));
app.use('/', require('./routes/user'));

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;