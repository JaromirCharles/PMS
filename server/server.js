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

  const { email, companyName } = req.body;

  // send emails via nodemailer
  mailer.sendRegistrationEmail(email, companyName);
  // add each email to tenant's employees list
  firestore.addEmpToTenantEmpArray(companyName, email);

  res.send(`I received your POST request. This is what you sent me: ${email}`);
});

app.post("/api/register", async (req, res) => {
  const [registrationSuccesfull, retMsg] = await firestore.registerTenant(
    req.body
  );
  console.log(`regSuc ${registrationSuccesfull}, retMsg ${retMsg}`);
  res.send({ registrationSuccesfull, retMsg });
});

app.post("/api/validateLogin", async (req, res) => {
  const { user, validate, companyName } = await firestore.checkCredentials(
    req.body.login.credentials
  );
  res.send({ user, validate, companyName });
});

app.post("/api/register_employee", async (req, res) => {
  const registrationSuccessfull = await firestore.registerEmployee(
    req.body.employee,
    req.body.tenant,
    req.body.password
  );
  res.send(true);
});

app.post("/api/available_jobs", async function (req, res) {
  const jobs = await firestore.getAvailableJobs(
    req.body.employeeEmail,
    req.body.companyName
  );
  res.send(jobs);
});

app.post("/api/tenant_jobs", async function (req, res) {
  const jobs = await firestore.getTenantJobs(req.body.tenant.companyName);
  res.send(jobs);
});

app.post("/api/tenant_employees", async function (req, res) {
  const employees = await firestore.getTenantEmployees(req.body.company);
  res.send(employees);
});

app.post("/api/tenant/create_job", async function (req, res) {
  const retVal = await firestore.createNewJob(req.body.newJob);
  res.send(retVal);
});

app.post("/api/tenant/edit_job", async function (req, res) {
  const retVal = await firestore.editJob(
    req.body.jobID,
    req.body.newJob,
    req.body.companyName
  );
  res.send("ok");
});

app.post("/api/tenant_applied_workers", async function (req, res) {
  const appliedWorkers = await firestore.getAppliedWorkers(
    req.body.companyName,
    req.body.jobID
  );
  res.send(appliedWorkers);
});

app.post("/api/tenant_selected_workers", async function (req, res) {
  const selectedWorkers = await firestore.getSelectedWorkers(
    req.body.companyName,
    req.body.jobID
  );
  res.send(selectedWorkers);
});

app.post("/api/tenant_update_selected_workers", async function (req, res) {
  await firestore.updateSelectedWorkers(
    req.body.companyName,
    req.body.jobID,
    req.body.action,
    req.body.list
  );
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
  const jobInfo = await firestore.getJobInfo(req.body.id, req.body.companyName);
  res.send({ jobInfo });
});

app.post("/api/employee/add_AppliedJob", async function (req, res) {
  const retVal = await firestore.addAppliedJob(
    req.body.employeeEmail,
    req.body.companyName,
    req.body.jobId
  );
  res.send("ok");
});

app.post("/api/employee/get_AppliedJobs", async function (req, res) {
  const appliedJobs = await firestore.getAppliedJobs(
    req.body.employeeEmail,
    req.body.companyName
  );
  res.send(appliedJobs);
});

app.post("/api/employee/get_UpcomingJobs", async function (req, res) {
  const appliedJobs = await firestore.getUpcomingJobs(
    req.body.employeeEmail,
    req.body.companyName
  );
  res.send(appliedJobs);
});

app.post("/api/employee/cancel_AppliedJob", async function (req, res) {
  const appliedJobs = await firestore.cancelAppliedJob(
    req.body.employeeEmail,
    req.body.companyName,
    req.body.jobId
  );
  res.send(appliedJobs);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
