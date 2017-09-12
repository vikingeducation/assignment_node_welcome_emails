require("dotenv").config();

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
  res.render("index");
});

app.post("/new", async (req, res) => {
  const { firstName, lastName, email } = req.body;

  console.log("env vars", process.env.EMAIL_USER);
  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome",
    text: `Hey! Welcome ${firstName} ${lastName}`,
    html: `<p>Hey! Welcome ${firstName} ${lastName}</p>`
  };

  try {
    const result = await emailService.send(options);
    console.log("result: ", result);
    return res.render("index", {
      message: "You registered!",
      result: JSON.stringify(result, null, 2)
    });
  } catch (err) {
    console.log("err: ", err);
    return res.json(err);
  }
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log("listening");
});
