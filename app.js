'use strict'
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var password = require('password-hash')
const flash = require('connect-flash');
const session = require('express-session')

//connecting to PostgreSQL database
const { Client } = require('pg')
const client = new Client({
  user: 'arry',
  host: 'localhost',
  database: 'pms',
  password: '12345',
  port: 5432
})
client.connect()

//router connection
var index = require('./routes/index')(client);
var profile = require('./routes/users')(client);
var projects = require('./routes/projects')(client);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'arry',
  resave: false,
  saveUninitialized: false
}))
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/profile', profile);
app.use('/projects', projects);

app.use(function(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.header("Pragma", "no-cache"); // HTTP 1.0.
  res.header("Expires", "-1"); // Proxies.
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
