const nodemailer = require('nodemailer');

const sendGridTransport = require('nodemailer-sendgrid-transport');

let _options;

let _options;
if (process.env.NODE_ENV === 'production') {
  _options = sendGridTransport({
    service: 'SendGrid',
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  });
} else {
  _options = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };
}

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
