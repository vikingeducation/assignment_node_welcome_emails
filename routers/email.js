const express = require("express");
const router = express.Router();
const EmailService = require("../services/email");

module.exports = app => {
  router.get("/", (req, res) => {
    res.render("emails/new");
  });

  router.post("/sendEmail", (req, res, next) => {
    const options = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Welcome From Node",
      text: `Hey! Welcome aboard ${req.body.fname} ${req.body.lname}!`,
      html: `<p>Hey! Welcome aboard ${req.body.fname} ${req.body.lname}!</p>`
    };

    EmailService.send(options)
      .then(result => {
        result.a = JSON.stringify(result, null, 2);
        res.render("emails/new", { result });
      })
      .catch(next);
  });
  return router;
};
