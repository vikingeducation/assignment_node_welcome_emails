const express = require("express");
const app = express();
const h = require("./helpers");

// .env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Templates
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application",
  helpers: require("./helpers")
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Post Data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Session
const expressSession = require("express-session");
app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret: "asdfsdfsdsdfasdsadfvui3qksf;"
  })
);

// Flash
const flash = require("express-flash-messages");
app.use(flash());

// Routes
app.use("/", require("./router"));

// Set up port/host
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";
let args = process.env.NODE_ENV === "production" ? [port] : [port, host];

// helpful log when the server starts
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

// Use apply to pass the args to listen
app.listen.apply(app, args);
