const express = require('express');
const app = express();
const registerRouter = require('./routes/registerEmail');

//bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

const flash = require('express-flash-messages');
app.use(flash());

//views
const expressHandlebars = require('express-handlebars');
const hbs = expressHandlebars.create({
	partialsDir: 'views',
	defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//ROUTES
app.use('/register', registerRouter);

const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
	console.log(`Listening: http://${host}:${port}\n`);
});

app.listen.apply(app, args);
