// require firebase admin to use firestore database
const admin = require("firebase-admin");

// initialize the firebase firestore sdk
let serviceAccount = require("../ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let db = admin.firestore();

function registerTenant(tenant) {
  console.log("registerTenant", tenant.state);
  const tenantUpdate = { ...tenant.state, employees: [] };
  db.collection("tenants").doc(tenant.state.name).set(tenantUpdate);
}

function registerEmployee(employee) {
  console.log("registerEmployee", employee.employee);
  db.collection("employees")
    .doc(employee.employee.email)
    .set(employee.employee);

  db.collection("tenants")
    .doc(employee.employee.tenant)
    .update({
      employees: admin.firestore.FieldValue.arrayUnion(employee.employee.email),
    });
}

async function checkCredentials(credentials) {
  var validate = false;
  var companyName = "";
  console.log("in test");
  let credRef = db.collection("tenants");
  let query = await credRef
    .where("email", "==", credentials.email)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        if (
          doc.data().email === credentials.email &&
          doc.data().password === credentials.password
        ) {
          validate = true;
          companyName = doc.data().name;
        } else {
          validate = false;
        }
      });
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
  return { validate, companyName };
}

async function getTenantJobs(companyName) {
  var jobs = [];
  console.log("getting jobs for: ", companyName);
  let query = await db
    .collection("tenants")
    .doc(companyName)
    .collection("jobs")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("getTenantJobs: No matching documents");
        return;
      }
      snapshot.forEach((job) => {
        //console.log(job.id, "=>", job.data());
        jobs.push({ ...job.data(), id: job.id });
      });
    })
    .catch((err) => {
      console.log("getTenantJobs: Error getting documents", err);
    });
  //console.log("collection Info: ", jobs);
  return jobs;
}

async function createNewJob(job) {
  var retVal = "failed";
  console.log(job);
  //db.collection("tenants").doc(job.tenant.companyName).set(tenantUpdate);
  db.collection("tenants")
    .doc(job.tenant.companyName)
    //.doc("test")
    .collection("jobs")
    .doc()
    .set(job.newJob);
  console.log(job);
  return retVal;
}

async function deleteJobs(jobs) {
  console.log(jobs.deleteJobList.deleteJobList);
  jobs.deleteJobList.deleteJobList.forEach((job) => {
    console.log(job);
    db.collection("tenants")
      .doc(jobs.deleteJobList.tenant.companyName)
      .collection("jobs")
      .doc(job)
      .delete();
  });
}

module.exports = {
  registerTenant,
  checkCredentials,
  registerEmployee,
  getTenantJobs,
  createNewJob,
  deleteJobs,
};
