const nodemailer = require('nodemailer');
const expressHandlebars = require('express-handlebars');
const hbs = expressHandlebars.create({
  partialsDir: 'views/',
  extname: '.hbs'
});

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASS
  }
});

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
            // text: reqBody.email_options.message,
            html: partial
          };

          resolve(EmailService.send(options));
        })
        .catch(e => reject(e));
    });

  }
};

module.exports = EmailService;
