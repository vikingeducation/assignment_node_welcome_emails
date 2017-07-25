# Node Welcome Emails

## Introduction
In this assignment, I implemented an example sign up page which sends you an email to your submitted accoutn information upon successful sign up.

## Technologies Used
Nodemailer, Node, Express, SendGrid

## Getting Started
For setting up on your local machine, first clone the repository, then install the dependencies. Create a .env file in the root directory with the following information:

```
EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=YOUR_PASS
```

This is the email account that nodemailer will use to send your emails. If using a gmail account, you will need to enable less secure apps to access your account. 

Finally, run the app with `node app.js`.

## 
A deployed version of this project may be found [here.](https://thawing-wave-13418.herokuapp.com/)

Please check your spam emails if you haven't received anything after a few minutes. You should receive a message from the SendGrid service.