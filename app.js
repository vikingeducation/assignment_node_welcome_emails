//////////////////////
// Boilerplate
//////////////////////

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const cookieSession = require('cookie-session');

app.use(
  cookieSession({
    name: 'session',
    keys: ['w00twoot']
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

app.use(express.static(`${__dirname}/public`));

const flash = require('express-flash-messages');
app.use(flash());

app.use((req, res, next) => {
  req.session.backUrl = req.header('Referer') || '/';
  next();
});

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

const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers').registered;

const hbs = expressHandlebars.create({
  helpers,
  partialsDir: 'views',
  defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//////////////////////
// Routes
//////////////////////

const EmailService = require('./services/email');

app.get('/', (req, res) => {
  res.render('home/index');
});

app.get('/users/register', (req, res) => {
  res.render('users/register');
});

app.post('/users/new', (req, res, next) => {
  const text = `You have successfully signed up with the following information: \nFirst name: ${req.body.user.firstName} \nLast name: ${req.body.user.lastName} \nEmail: ${req.body.user.email} \nPassword: ${req.body.user.password}`;

  const options = {
    from: 'nicromvfs@gmail.com',
    to: req.body.user.email,
    subject: `Welcome aboard, ${req.body.user.firstName} ${req.body.user.lastName}`,
    text: text,
    html: `<p>${text}</p>`
  };

  EmailService.send(options)
    .then(() => {
      req.flash('success', 'Sent!');
      res.render('users/success');
    })
    .catch(next);
});

//////////////////////
// Server and Errors
//////////////////////

const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

app.listen.apply(app, args);

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
