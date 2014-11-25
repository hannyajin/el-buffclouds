
var loginRouter = require('./routes/login');
var apiRouter = require('./routes/api');

module.exports = {
  login: loginRouter,
  api: apiRouter
}