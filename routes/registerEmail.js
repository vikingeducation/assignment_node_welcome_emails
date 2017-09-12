const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const bluebird = require('bluebird');
const Promise = bluebird;

require('dotenv').config();

router.get('/', (req, res) => {
	res.render('register');
});
router.post('/', async (req, res) => {
	//grab our form data
	const formData = {
		firstName: req.body.first_name,
		lastName: req.body.last_name,
		email: req.body.email,
		password: req.body.password
	};
	//send off to email services
	//// Use Heroku's SendGrid ENV variables
	const _options = {
		service: 'SendGrid',
		auth: {
			api_user: process.env.SENDGRID_USERNAME,
			api_key: process.env.SENDGRID_PASSWORD
		}
	};

	// Create the SendGrid transport
	const _transporter = nodemailer.createTransport(sendGridTransport(_options));
	_transporter.sendMail = bluebird.promisify(_transporter.sendMail);

	console.log(JSON.stringify(formData, null, 2));

	let text = `Merry Christmas, ya filthy animal, and a Happy new year. ${formData.firstName} ${formData.lastName} - Welcome to the club bruh!`;
	text = text.concat(JSON.stringify(formData, null, 2));

	const email = {
		to: [
			formData.email,
			'drewdiddy611@gmail.com',
			'henrydontshowmeyourlegs@gmail.com'
		],
		from: 'no-reply@email-sending-thing-a-ma-jigger.com',
		subject: `I'm craaaaaazzzy`,
		text: text
	};

	try {
		const res = await _transporter.sendMail(email);
		console.log(res);
	} catch (err) {
		console.err(err, err.stack);
	}
});

module.exports = router;
