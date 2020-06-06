// require Express to allow the usage within server.js file
const express = require("express");
const bodyParser = require("body-parser");
// require our mailer module
const mailer = require("./actions/mailer");
const app = express();
// set the port the express server will run on
const port = process.env.PORT || 5000;

/* attach a body object {} to the front end http req and parse any
 * json data that was include
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create a GET route
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/invitation", (req, res) => {
  // destructure the email property from the http request send from the front end
  const { email } = req.body;
  //console.log(email.emailList);
  const list = email.emailList;
  console.log("list", list);
  list.map((e) => {
    // send emails via nodemailer
    console.log("sending to ", e)
    mailer.sendRegistrationEmail(e);
  });

  res.send(
    `I received your POST request. This is what you sent me: ${req.body.email.emailList}`
  );
});

// console.log that the server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
