// require Express to allow the usage within server.js file
const express = require("express");
const bodyParser = require("body-parser");
// require our mailer module
const mailer = require("./actions/mailer");
// reguire our firebase firestore module
const firestore = require("./models/firestore");

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

app.post("/api/invitation", async (req, res) => {
  // destructure the email property from the http request send from the front end
  const { email } = req.body;
  const tenant = req.body.email.tenant.companyName;
  console.log("tenant: ", tenant);
  const list = email.emailList;
  console.log("list", list);
  list.map((e) => {
    // send emails via nodemailer
    console.log("sending to ", e);
    mailer.sendRegistrationEmail(e, tenant);
    // add each email to tenant's employees list
    firestore.addEmpToTenantEmpArray(tenant, e);
  });


  res.send(
    `I received your POST request. This is what you sent me: ${req.body.email.emailList}`
  );
});

app.post("/api/register", (req, res) => {
  //console.log("received: ", req.body);
  firestore.registerTenant(req.body.tenant);
  res.send("registered tenant");
});

app.post("/api/validateLogin", async (req, res) => {
  const { validate, companyName } = await firestore.checkCredentials(
    req.body.login.state
  );
  //console.log("server.js companyName: ", companyName)
  res.send({ validate, companyName });
});

app.post("/api/validateEmployeeLogin", async (req, res) => {
  console.log(req.body);
  const { validate, companyName } = await firestore.checkEmployeeCredentials(
    req.body.login.state
  );
  console.log(`validate ${validate}, companyName: ${companyName}`);
  res.send({ validate, companyName });
});

app.post("/api/register_employee", async (req, res) => {
  await firestore.registerEmployee(req.body.employee);
  res.send("registered employee");
});

app.post("/api/tenant_jobs", async function (req, res) {
  const jobs = await firestore.getTenantJobs(req.body.tenant.companyName);
  res.send(jobs);
});

app.post("/api/tenant_employees", async function (req, res) {
  const employees = await firestore.getTenantEmployees(req.body.company);
  res.send(employees)
});

app.post("/api/tenant/create_job", async function (req, res) {
  //console.log("/api/tenant/create_job: ", req.body.newJob)
  const retVal = await firestore.createNewJob(req.body.newJob);
  res.send(retVal);
});

app.post("/api/tenant/edit_job", async function (req, res) {
  //console.log(req.body)
  const retVal = await firestore.editJob(req.body.jobID, req.body.newJob, req.body.companyName)
});
/**
 * Deletes a list of jobs.
 * @param {req.body} the list of jobs to delete.
 * @return {retVal} String signaling if all jobs have been deleted.
 */
app.post("/api/tenant/delete_jobs", async function (req, res) {
  const retVal = await firestore.deleteJobs(req.body);
  res.send("ok");
});

app.post("/api/get_job_info", async function (req, res) {
  //console.log(req.body);
  const jobInfo = await firestore.getJobInfo(req.body.id, req.body.companyName);
  res.send({ jobInfo });
});

app.post("/api/tenant/add_AppliedJob", async function (req, res) {
  console.log(req.body.employeeEmail);
  console.log(req.body.jobId);
  console.log(req.body.companyName);
  const retVal = await firestore.addAppliedJob(
    req.body.employeeEmail,
    req.body.companyName,
    req.body.jobId
  );
  res.send("ok");
});

// console.log that the server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
