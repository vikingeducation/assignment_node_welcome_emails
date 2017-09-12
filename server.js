const express = require("express");
const app = express();

require("dotenv").config();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var morgan = require("morgan");
app.use(morgan("tiny"));

var expressHandlebars = require("express-handlebars");
var hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

let transport_options;
let _transport;

// production use case
if (process.env.NODE_ENV === "production") {
  transport_options = {
    service: "SendGrid",
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };
  _transporter = nodemailer.createTransport(
    sendGridTransport(transport_options)
  );
} else {
  // development use case
  transport_options = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };
  _transporter = nodemailer.createTransport(transport_options);
}

// Email service
const EmailService = {
  send: options => {
    return new Promise((resolve, reject) => {
      _transporter.sendMail(options, (err, info) => {
        err ? reject(err) : resolve(info);
      });
    });
  }
};

// redirect
app.get("/", (req, res, next) => {
  res.redirect("/users/new");
});

// GET route
app.get("/users/new", (req, res) => {
  res.render("users/new");
});

//POST route
app.post("/users/new", (req, res) => {
  const message = `Welcome to this amazing website! You've made the right choice by signing up with us. We will only spam you 16x per hour. That's what makes us great!`;
  options = {
    from: process.env.EMAIL_USER,
    to: req.body.user.email,
    subject: `Welcome Aboard, ${req.body.user.fname} ${req.body.user.lname}!`,
    text: message,
    html: `<p>${message}</p>`
  };

  EmailService.send(options)
    .then(result => {
      res.render("users/finish", { flash: result });
    })
    .catch(e => {
      console.error(e);
    });
});

var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";
var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});
app.listen.apply(app, args);

module.exports = app;
