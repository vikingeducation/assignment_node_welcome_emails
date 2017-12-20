# assignment_node_welcome_emails
Send emails in Node!

## Maddie Rajavasireddy

### Assignment Description:
Sending Welcome Emails
----
Setup a simple application to "register users" and send welcome emails to those users.

Note we won't be building this application out to a full extent so it is completely fine to not use a database nor attempt to store user data.

Create a "Users New" view with a registration form and the following fields:
First name
Last name
Email
Password (won't actually get used, just for show)
Setup routes for both displaying the registration form and a POST route to which the form will submit its data
Create an EmailService that will send a welcome email to the new user's email address with the following content:
A welcoming message like, "Hey! Welcome aboard George Costanza!"
A confirmation of their submitted data (name, email, password etc...)
The service should use the well-known Gmail service with your Gmail credentials
Note to allow less secure apps in your Gmail account and use dotenv to set your credentials as environment variables
Verify that you can send email to your Gmail via your app    

Sending Emails on Heroku
----
Now setup your app to use SendGrid on Heroku.

Create the SendGrid addon via the Heroku Toolbelt (be sure to use the free starter tier!)
Alter your EmailService to use the SendGrid transport and Heroku SendGrid credentials when your app is in production.
Your app should still use the Gmail service in other environments (development)
Deploy your app to Heroku and verify that you can send email from your deployed app


#### Running App:    
`npm start`   
Deployed at: https://secure-sea-50812.herokuapp.com
