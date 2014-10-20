var nodemailer = require('nodemailer');

var nm = require('./private/auth.json').nodemailer;

var transporter = nodemailer.createTransport({
  service: nm.service,
  auth: nm.auth
});

// defaults
var defopts = {
  from: 'Buffclouds <' + nm.auth.user + '>',
  to: '',
  subject: 'Buffclouds Default Subject',
  text: 'Buffclouds Default Text.',
  html: '<p>Buffclouds Default Text.</p>'
};

function sendMail(opts, callback) {
  var newMail = {
    from: opts.from || defopts.from,
    to: opts.to || defopts.to,
    subject: opts.subject || defopts.subject,
    text: opts.text || defopts.text,
    html: opts.html || defopts.html
  };

  if (callback) {
    transporter.sendMail(newMail, function(err, info) {
      callback(err, info);
    });
  } else {
    callback('Error: No callback specified.');
  }
};

module.exports = {
  sendMail: sendMail
}