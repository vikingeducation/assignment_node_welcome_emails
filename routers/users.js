const express = require('express');
const router = express.Router();
const EmailService = require('../services/email_service');

const registrationAction = (req, res) => {
  res.render('users/new');
};

router.get('/', registrationAction);
router.get('/new',registrationAction);

router.post('/', (req, res) => {
  EmailService.sendWelcome(req.body)
    .then(() => {
      req.flash('success', "Congrats, you've registered!!");
      res.redirect('/');
    });
});

module.exports = router;
