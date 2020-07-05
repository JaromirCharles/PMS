// actions/mailer.js
const nodemailer = require("../models/nodemailer");

const mailer = {
  sendRegistrationEmail: function (email, tenant) {
    const { transporter, mailtrapTransporter, mailOptions } = nodemailer;
    const recipient = email;
    // add to recipient and html: to mailOptions
    const emailBody = `Hi there,<br/><br/><b>${tenant}</b> would like you to join their Personnel Management System to always be up to date with their current jobs. Click the following link to register to <b>${tenant}'s</b> PMS.<br/><br/><a href=\"http://localhost:3000/register/${tenant}\">Register now</a>`;
    const options = { ...mailOptions, to: recipient, html: emailBody };
    //console.log(options);
    transporter.sendMail(options, function (err, info) {
      if (err) {
        console.error("unable to send confirmation email" + err);
      }
      // can do something with info here
    });
  },
};

module.exports = mailer;
