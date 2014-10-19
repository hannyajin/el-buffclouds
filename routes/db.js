var express = require('express');
var router = express.Router();



/* Connect to Mongo DataBase */
var mongoose = require('mongoose');
var mongouri = require('./private/auth.json').mongo.uri;

var mongo_opts = { keepAlive: 1 };
var db = mongoose.createConnection(mongouri, mongo_opts);

db.on('error', console.log.bind(console, 'db connection error:'));
db.once('open', function mongo_open() {
  console.log("Connected to DataBase.");
});


/** Configure Schemas
  */
var Schema = db.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  email: String,
  username: String,
  password: String,

  clouds: [cloudSchema] // Cloud Ids
  comments: [commentSchema],

  email_verified: { type: Boolean, default: false }, // if email has been verified

  date: { type: Date, default: Date.now }
});

var cloudSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  creator: userSchema,
  cloud: cloudSchema, // sub-cloud?

  title: String,
  desc: String,
  members: [userSchema], // // User Ids
  tags: [String],

  invites: [String], // emails

  date: { type: Date, default: Date.now }
});

var linkSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  creator: userSchema,
  cloud: cloudSchema,

  title: String
  pictures: [String], // picture urls
  img_index: { type: Number, default: 0 }, // default first linked picture
  tags: [String],
  comments: [commentSchema],

  date: { type: Date, default: Date.now }
});

var commentSchema = new Schema({
  _id: { type: ObjectId, auto: true },
  creator: userSchema,
  link: linkSchema,

  text: String,
  
  date: { type: Date, default: Date.now }
})


/** REST API
  */

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


/* Expose outside */
module.exports = {
  type: 'MongoDB',
  router: router
}