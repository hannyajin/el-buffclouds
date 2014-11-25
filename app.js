/**
    Title: Buffclouds app server
    desc: Elance Work Project
    author: Christian Talmo @hannyajin jin.fi
    client: Peter Kildegaard
    */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

var flash = require('connect-flash'); // auth msgs (wrong user/pass etc)
var session = require('express-session');


// configure database
var db = require('./db');
// configure passport (authentication)
var passport = require('./passport');
var router = require('./router');

/** Init App
---------------------*/
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

//
app.use(favicon(__dirname + '/public/img/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookies & session
//app.use(cookieParser('buffclouds'));
//app.use(session({ cookie: { maxAge: (1000 * 3600) }, secret: 'buffclouds secret' }));

// setup jwt (replaces cookies)
var jwtSecret = require('./private/auth').jwtSecret;
var validateJwt = expressJwt({secret: jwtSecret});
// jwt middleware
app.use('/auth', function (req, res, next) {
    validateJwt(req, res, next);
});

// connect-flash
//app.use(flash());

// passport
app.use(passport.initialize());
//app.use(passport.session()); // no need for sessions since we're using jwt

//  less middleware and root directory
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


/** Configure routes
----------------------*/
app.use('/', router.login);
app.use('/api/v0/', router.api);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
