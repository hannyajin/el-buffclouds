var router = require('express').Router();
var db = require('../db');

router.get('/', function (req, res) {
  res.send('API');
});

module.exports = router;