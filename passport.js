
var db = require('./db').connection; // get mongo connection

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var test_user = {
  name: 'Blinky',
  pass: 'blinkypass',
  _id: 'blinkyID'
}

// configure passport
passport.use(new LocalStrategy(function(username, password, done) {
  console.log("username: " + username);
  console.log("password: " + password);

  if (username === test_user.name) {
    if (password === test_user.pass) {
      return done(null, test_user);
    }
  }


  return done(null, false, { message: "No such username."} );
}));




// configure seralization & deserialization
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  if (id === 'blinkID') {
    done(null, test_user);
  }
});


module.exports = passport;