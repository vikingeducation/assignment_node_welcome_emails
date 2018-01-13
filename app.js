const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use((req, res, next) => {
  res.locals.siteTitle = 'Node Welcome Emails';
  next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const cookieSession = require('cookie-session');

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'asdf1234567890qwer']
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

const flash = require('express-flash-messages');
app.use(flash());

// Logging
const morgan = require('morgan');
const highlight = require('cli-highlight').highlight;

// Add :data format token
// to `tiny` format
let format = [
  ':separator',
  ':newline',
  ':method ',
  ':url ',
  ':status ',
  ':res[content-length] ',
  '- :response-time ms',
  ':newline',
  ':newline',
  ':data',
  ':newline',
  ':separator',
  ':newline',
  ':newline'
].join('');

// Use morgan middleware with
// custom format
app.use(morgan(format));

// Helper tokens
morgan.token('separator', () => '****');
morgan.token('newline', () => '\n');

// Set data token to output
// req query params and body
morgan.token('data', (req, res, next) => {
  let data = [];
  ['query', 'params', 'body', 'session'].forEach(key => {
    if (req[key]) {
      let capKey = key[0].toUpperCase() + key.substr(1);
      let value = JSON.stringify(req[key], null, 2);
      data.push(`${capKey}: ${value}`);
    }
  });
  data = highlight(data.join('\n'), {
    language: 'json',
    ignoreIllegals: true
  });
  return `${data}`;
});

// Template engine
const expressHandlebars = require('express-handlebars');
const h = require('./helpers');

const hbs = expressHandlebars.create({
  partialsDir: 'views/',
  defaultLayout: 'application',
  helpers: h
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Routes
const EmailService = require('./services/email');

app.get('/', (req, res) => {
  res.render('users/new');
});

app.post('/users', (req, res, next) => {
  const { fname, lname, email, password } = req.body.user;
  const html = h.html(fname, lname, email, password);

  const options = {
    from: 'node.welcome@mail.com',
    to: req.body.user.email,
    subject: 'Welcome aboard!',
    html: html
  };

  EmailService.send(options)
    .then(result => {
      req.flash('success', 'Check your inbox for a welcome email!');
      res.redirect('back');
    })
    .catch(next);
});

// Server
const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

// Error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render('errors/500', { error: err });
});

module.exports = app;
