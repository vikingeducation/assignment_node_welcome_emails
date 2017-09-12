const router = require("express").Router();

const EmailService = require("./services/email");

router.get("/", (req, res) =>
  res.render("register", {
    status: JSON.stringify(req.session.status, null, 2)
  })
);

router.post("/register", (req, res) => {
  const { email, fname, lname, password } = req.body;
  const message = `We're glad to have you aboard, ${fname} ${lname}! By the way, your password is ${password}. We are a very secure site here at UselessApp.`;

  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to UselessApp!",
    text: message,
    html: `<p>${message}</p>`
  };

  EmailService.send(options)
    .then(result => {
      req.session.status = result;
      req.flash("success", "Sent!");
      res.redirect("/");
    })
    .catch(e => {
      req.flash("danger", "There was an error :(");
      req.session.status = e.stack;
      res.redirect("/");
    });
});

module.exports = router;
