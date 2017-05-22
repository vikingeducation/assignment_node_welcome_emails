const express = require("express");
const app = express();

// ----------------------------------------
// ENV
// ----------------------------------------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ----------------------------------------
// Site Config
// ----------------------------------------
app.use((req, res, next) => {
  res.locals.siteTitle = "Nodemailer Test";
  next();
});

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");

const hbs = expressHandlebars.create({
  partialsDir: "views",
  defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Routes
// ----------------------------------------
const EmailService = require("./services/email");

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res, next) => {
  const options = {
    to: req.body.email,
    from: "fbi@fbi.gov",
    subject: "FBI things",
    text: `Welcome to the FBI, ${req.body.name}`,
    html: `<p>Welcome to the FBI, ${req.body.name}</p>`
  };

  EmailService.send(options)
    .then(result => {
      console.log(result);
      result = JSON.stringify(result, null, 2);
      res.render("login", { result });
    })
    .catch(next);
});
// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

app.listen.apply(app, args);

// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).send(err);
});

module.exports = app;
