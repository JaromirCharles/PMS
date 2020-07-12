// models/nodemailer.js

const nodemailer = require("nodemailer");
const config = require('../config/config.json');
const auth = config.auth

// gmail transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  //service: "gmail",
  port: 465, //587,
  secure: true, //false,
  auth: auth,
  /* auth: {
    user: "pmsystememail@gmail.com",
    pass: "pmsforcad",
  }, */
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
