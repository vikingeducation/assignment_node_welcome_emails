const nodemailer = require('nodemailer');

const sendGridTransport = require('nodemailer-sendgrid-transport');

let _options;

_options = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

const _transporter = nodemailer.createTransport(_options);

const EmailService = {
  send: options => {
    return new Promise((resolve, reject) => {
      _transporter.sendMail(options, (err, info) => {
        err ? reject(err) : resolve(info);
      });
    });
  }
};

module.exports = EmailService;
