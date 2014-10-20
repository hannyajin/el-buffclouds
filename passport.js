
var db = require('./db');
var models = db.models;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sha1 = require('sha1');

var test_user = {
  name: 'Blinky',
  pass: 'blinkypass',
  _id: 'blinkyID'
}

// configure passport
passport.use(new LocalStrategy(function(username, password, done) {
  console.log("username: " + username);
  console.log("password: " + password);
  console.log("sha: " + sha1(password || ""));

  models.User.findOne({ username: username, password: sha1(password || "")}, function (err, user) {
    if (err) {
      console.log("Error retreiving passport user login: " + err);
      res.status(500).end();
      return done(err);
    }

    if (user) {
      console.log("User logged in!");
      return done(null, user);
    }

    return done(null, false, { message: "No such username."} );
  });
}));


// configure seralization
passport.serializeUser(function(user, done) {
  return done(null, user._id);
});

// configure deserialization
passport.deserializeUser(function(id, done) {

  models.User.findOne({ _id: id}, function (err, user) {
    if (err) {
      console.log("Error deserializing passport user ID: " + err);
      return done(err);
    }

    if (user) {
      return done(null, user);
    }

    return done(null, null); // no such user with id found
  });
});


module.exports = passport;