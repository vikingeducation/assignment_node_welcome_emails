const express = require('express');
const router = express.Router();
const EmailService = require("./../services/email");

router.get("/", (req, res) => {
  if (req.session.user) {
    res.render("main/index");
  } else {
    res.redirect('/register');
  }
});

router.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

router.post('/register', (req, res) => {
  let message = `Greetings ${req.body.registration.fname} ${req.body.registration.lname}! Thank you for signing up!`;
  const options = {
    to: req.body.registration.email,
    subject: "Welcome!",
    text: message,
    html: `<p>${message}</p>`
  };

  EmailService.send(options)
    .then(result => {
      req.flash("success", "Thank you for signing up!");
      req.session.user = req.body.registration.fname + req.body.registration.lname;
      res.redirect('/');
    })
    .catch(e => {
      if (e.errors) {
        let errors = Object.keys(e.errors);

        errors.forEach(error => {
          req.flash('error', e.errors[error].message);
        });
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.get('/logout', (req, res) => {
  for (let key in req.session) {
    delete req.session[key];
  }
  res.redirect('/register');
});

router.post("/emails", (req, res, next) => {


  
});

module.exports = router;