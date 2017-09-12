const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("register");
});
router.post("/", (req, res) => {
  //grab our form data
  const formData = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  };
  //send off to email services
});
