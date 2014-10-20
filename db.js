/** Configure the database and its dependencies
  */

var express = require('express');
var router = express.Router();

/* Connect to Mongo DataBase */
var mongoose = require('mongoose');
var mongouri = require('./private/auth.json').mongo.uri;  // secret from private file

var mongo_opts = { keepAlive: 1 };
var db = mongoose.createConnection(mongouri, mongo_opts);

db.on('error', console.log.bind(console, 'db connection error:'));
db.once('open', function db_open() {
  console.log("Connected to DataBase.");
});


/** Configure Schemas
  */
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  email: String,
  username: String,
  password: String,

  clouds: [cloudSchema], // Cloud Ids
  comments: [ { type: ObjectId, ref: 'Comment'} ],

  date: { type: Date, default: Date.now }
});

var cloudSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  creator: { type: ObjectId, ref: 'User' },
  cloud: { type: ObjectId, ref: 'Cloud' }, // parent-cloud

  title: String, // max 50
  desc: String, // nax 150
  tags: [String],

  members: [{ type: ObjectId, ref: 'User' }], // // User Ids
  invites: [String], // emails

  old_usernames: [String], // list of old usernames
  old_emails: [String], // list of old emails

  date: { type: Date, default: Date.now }
});

var linkSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  creator: { type: ObjectId, ref: 'User' },
  cloud: { type: ObjectId, ref: 'Cloud' },

  title: String, // max 50
  desc: String, // max 100
  pictures: [String], // picture urls
  img_index: { type: Number, default: 0 }, // default first linked picture
  tags: [String],
  comments: [ { type: ObjectId, ref: 'Comment'} ],

  date: { type: Date, default: Date.now }
});

var commentSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  creator: { type: ObjectId, ref: 'User' },
  link: { type: ObjectId, ref: 'Link'},

  text: String, // max 200
  
  date: { type: Date, default: Date.now }
});

var settingsSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  user: { type: ObjectId, ref: 'User'}, // users specific settings

  emails: Boolean, // on / off
  emailsNotifications: Boolean, // on / off

  updates: [Date] // list of update times
});


// Not in spec
var personalMessageSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  from: { type: ObjectId, ref: 'User' },
  to: { type: ObjectId, ref: 'User' },

  title: String,
  text: String,

  date: { type: Date, default: Date.now }
});

// Not in spec
var httpReqSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  
  from: String,
  url: String,

  date: { type: Date, default: Date.now }
});

/** Initialize Models
  */
var models = {
  User: db.model('User', userSchema),
  Cloud: db.model('Cloud', cloudSchema),
  Link: db.model('Link', linkSchema),
  Comment: db.model('Comment', commentSchema)
}


/** REST API
  */

/* GET users listing. */
router.get('/', function(req, res) {
  console.log('in api get');
  res.send('user: ' + req.user);
});


/* Expose outside */
module.exports = {
  type: 'Mongo',
  router: router,
  models: models,
  connection: db 
}