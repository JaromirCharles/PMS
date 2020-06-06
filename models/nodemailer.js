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
  html:
    'Hi there,<br/><br/>"Company" would like you to join their Personnel Management System to always be up to date with their current jobs.Click the following link to register to "Company\'s PMS system.',
};

module.exports = {
  transporter,
  mailtrapTransporter,
  mailOptions,
};
