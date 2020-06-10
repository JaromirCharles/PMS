// actions/mailer.js
const nodemailer = require("../models/nodemailer");

const mailer = {
  sendRegistrationEmail: function (email) {
    const { transporter, mailtrapTransporter, mailOptions } = nodemailer;
    const recipient = email;
    console.log("recipient: ", recipient);
    const options = { ...mailOptions, to: recipient };
    console.log(options);
    mailtrapTransporter.sendMail(options, function (err, info) {
      if (err) {
        console.error("unable to send confirmation email" + err);
      }
      // can do something with info here
    });
  },
};

module.exports = mailer;
