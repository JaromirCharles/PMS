// models/nodemailer.js

const nodemailer = require("nodemailer");
// const config = require('../config/keys');

// gmail transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pmsystememail@gmail.com",
    pass: "pmsforcad",
  },
});

// mailtrap transport
var mailtrapTransporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "bd80f37a1c5d83",
    pass: "3105babd0acf34",
  },
});

const mailOptions = {
  from: "pmsystememail@gmail.com",
  subject: "pms registration",
};

module.exports = {
  transporter,
  mailtrapTransporter,
  mailOptions,
};
