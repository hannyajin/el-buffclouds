/** Registeration and Login
  */
var express = require('express');
var router = express.Router();
var passport = require('passport');

var pendingActivationList = {};
var pendingUsernames = [];

function isUsernameFree(username) {
  for (var i = 0; i < pendingUsernames.length; i++) {
    if (pendingUsernames[i] === username) {
      return false;
    }
  }
  return true;
};

var sha1 = require('sha1');
var emailbot = require('../emailbot');

var db = require('../db');
var models = db.models;

var base_url = "http://localhost:3000/"
var verify_url = "activate/";
var who_was = "whowas/";

var activation_timeout = 1000 * 60 * 60 * 24 * 7 * 4 * 12 * 2; // 2 years

var jwtSecret = require('../private/auth').jwtSecret;

/* POST login
---------------*/
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json(404, 'No user found...');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      var token = jwt.sign({
        username: user.username
      }, jwtSecret);
      return res.json(200, {token: token, user: user});
    });
  })(req, res, next);
});

/* GET Logout
---------------*/
router.get('/logout', function(req, res) {
  req.logOut();

  return res.status(200).json({
    status: 200,
    message: "You've successfully logged out.",
    developerMessage: "You've successfully logged out."
  }).redirect('/').end();
});


/* GET Activate account
-------------------------*/
router.get('/activate/:sha', function(req, res) {
  var sha = req.params.sha;
  var obj = pendingActivationList[sha];

  if (obj) {
    if (Date.now() < (obj.date + activation_timeout || (1000*60*60)) ) {
      // Accept the verification, create User object
      var json = obj.req.body; // get the registration credentials

      // Make sure the user doesn't exist yet
      models.User.findOne({ username: json.username }, function (err, user) {
        if (err) {
          console.log('Activation error: ' + err);
          return res.status(500).end();
        }

        if (!user) { // username available
          models.User.findOne({ email: json.email }, function (err, email) {
            if (err) {
              console.log('Activation error: ' + err);
              return res.status(500).end();
            }

            if (!email) { // email available
              // clean the username from pending list (no longer needed)
              pendingUsernames.splice(pendingUsernames.indexOf(json.username), 1);

              // Create the actual data base object
              var user = new models.User({
                email: json.email,
                username: json.username,
                password: sha1(json.password || ""), // don't store in plain text

                date: Date.now() // date of creation
              });

              // save the object into the database
              user.save(function (err, user) {
                if (err) {
                  console.log("Error in saving new user to Database: " + err);
                  return res.status(500).end();
                }

                // send confirmation to the user
                return res.status(200).json({
                  status: 200,
                  message: "You've successfully activated your account! You can now login.",
                  developerMessage: "You've successfully activated your account! You can now login."
                }).end();

              }); // user.save(...)

            } else {
              // email taken
              return res.json({ type: 'error', message: "That email has already been registered." });
            }
          });
        } else {
          // username taken
          return res.json({ type: 'error', message: "That name isn't available." });
        }
      });


    } else {
      res.status(410).json({
        status: 410,
        message: "Activation time expired.",
        developerMessage: "Activation time expired."
      }).end();
    }
  } else {
    return res.status(410).json({
      status: 410,
      message: "Activation time expired or not found.",
      developerMessage: "Activation time expired or not found."
    }).end(); // not found
  }
});


/** POST registration
  */
router.post('/register', function(req, res) {
  var json = req.body;

  console.log('In /register of account.js');
  console.log("json: " + JSON.stringify(json));

  models.User.findOne({ username: json.username }, function (err, user) {
    if (err) {
      console.log('Registration error: ' + err);
      return res.status(500).end();
    }
    if (!user && isUsernameFree( json.username )) { // username available
      models.User.findOne({ email: json.email }, function (err, email) {
        if (err) {
          console.log('Registration error: ' + err);
          return res.status(500).end();
        }
        if (!email) { // email available

          /**  Create a new temporary user awaiting email verification.
            */
          pendingUsernames.push( json.username ); // pre-order the username
          var sha = sha1(json.username + Date.now() + "buffclouds"); // create sha out of request object

          // save the full request temporarily 
          pendingActivationList[sha] = {
            req: req,
            date: Date.now()
          }


          /** Send email */
          var app = require('../app');
          var opts = {
            name: json.username,
            title: "Buffclouds account activation.",
            activate_link: base_url + verify_url + sha,
            whois_link: base_url + who_was + sha
          };
          app.render('emails/verify', opts, function(err, html) {
            if (err) {
              console.log("Email error: Couldn't RENDER email verification mail: " + err);
              return res.status(500).end();
            }

            var mail = {
              to: json.email,
              html: html
            }

            emailbot.sendMail(mail, function(err, info) {
              if (err) {
                console.log("Email error: Couldn't SEND email verification mail: " + err);
                return res.status(500).end();
              }

              console.log("Email verification sent: " + info.response);

              return res.status(200).json({
                status: 200,
                message:
                  "Success! Please verify your email by clicking the link\
                   sent to ["+ json.email +"] to login."
              }).end();
            });
          });

        } else { // email already taken
          return res.status(400).json({
            status: 400,
            message: "That email has already been registered.",
            developerMessage: "That email has already been registered."
          }).end();
        }
      });
    } else { // username taken
      return res.status(400).json({
       status: 400,
       message: "That name isn't available.",
       developerMessage: "That name isn't available."
     }).end();
    }
  });
});


module.exports = router;