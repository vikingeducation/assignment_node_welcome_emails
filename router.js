const router = require("express").Router();

router.get("/", (req, res) => res.render("register"));

router.post("/register", (req, res) => {
  const { email, fname, lname, password } = req.body;
  // send email...
  res.redirect("/");
});

module.exports = router;
