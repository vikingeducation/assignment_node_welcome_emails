const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const emailService = require("./services/emailService");
app.use(bodyParser.urlencoded({ extended: false }));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    partialsDir: "views"
  })
);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  //body parser the form data

  res.render("index");
});

app.post("/new", (req, res) => {
  const { firstName, lastName, email } = req.body;
  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome'
    text:`Hey! Welcome ${firstName} ${lastName}`
    html:`<p>Hey! Welcome ${firstName} ${lastName}</p>`
  }

  res.redirect("index", { message: "You registered!" });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("listening");
});
