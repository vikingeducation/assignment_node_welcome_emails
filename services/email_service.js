const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const expressHandlebars = require('express-handlebars');
const hbs = expressHandlebars.create({
  partialsDir: 'views/',
  extname: '.hbs'
});

let transportOptions;

if (process.env.NODE_ENV === 'production') {
  const options = {
    service: 'SendGrid',
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };
  transportOptions = sendGridTransport(options);
} else {
  transportOptions = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASS
    }
  };
}

const transporter = nodemailer.createTransport(transportOptions);

const EmailService = {
  send: options => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(options, (err, info) => {
        err ? reject(err) : resolve(info);
      });
    });
  },

  sendWelcome: reqBody => {
    return new Promise((resolve, reject) => {
      hbs.render('views/welcome_email.hbs', { userName: reqBody.fullName })
        .then(partial => {
          const options = {
            from: 'nodeemailtester@gmail.com',
            to: reqBody.email,
            subject: 'Welcome to... well nothing!',
            html: partial
          };

          resolve(EmailService.send(options));
        })
        .catch(e => reject(e));
    });

  }
};

module.exports = EmailService;
