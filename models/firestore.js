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
  // add employee to employees collection
  db.collection("employees")
    .doc(employee.employee.email)
    .set(employee.employee);

  // add employee's email to tenant's employee array
  /* db.collection("tenants")
    .doc(employee.employee.tenant)
    .update({
      employees: admin.firestore.FieldValue.arrayUnion(employee.employee.email),
    }); */

  // add employee to login collection
}

async function checkCredentials(credentials) {
  var validate = false;
  var companyName = "";
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

async function checkEmployeeCredentials(credentials) {
  var validate = false;
  var companyName = "";
  let credRef = db.collection("employees");
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
          companyName = doc.data().tenant;
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
  //console.log("getting jobs for: ", companyName);
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

async function addEmpToTenantEmpArray(tenant, email) {
  db.collection("tenants")
    .doc(tenant)
    .update({
      employees: admin.firestore.FieldValue.arrayUnion(email),
    });
}

async function getTenantEmployees(companyName) {
  var employees = [];
  var employees_in_tenants_array = [];
  // get listed employees within tenant's employees array
  let query = await db
    .collection("tenants")
    .doc(companyName)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        //console.log("Document data:", doc.data().employees);
        employees_in_tenants_array = doc.data().employees;
      }
    });

  // get employee information for each employee in tenant array
  for (let index = 0; index < employees_in_tenants_array.length; index++) {
    //console.log("--: ", employees_in_tenants_array[0]);
    let query = await db
      .collection("employees")
      .doc(employees_in_tenants_array[index])
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No such document");
          // employee has no registered as yet.
          employees.push({
            name: "",
            surname: "",
            email: employees_in_tenants_array[index],
            status: "Request pending",
          });
          //return { name: "-", surname: "-", email: emp, status: "Request pending" };
        } else {
          //console.log("found: ", doc.data());
          // employee has already registered under this email
          employees.push({
            name: doc.data().name,
            surname: doc.data().surname,
            email: doc.data().email,
            status: "active",
          });
          //return { name: doc.data().name, surname: doc.data().surname, email: emp, status: "active" };
          //console.log("--------: ", employees);
        }
      });
  }

  return employees;
}

async function createNewJob(job) {
  var retVal = "failed";
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

async function addAppliedJob(employeeEmail, companyName, jobReferenceId) {
  db.collection("employees")
    .doc(employeeEmail)
    .update({
      appliedJobs: admin.firestore.FieldValue.arrayUnion(jobReferenceId),
    });
}

async function getJobInfo(jobID, companyName) {
  var jobInfo = {};
  let query = await db
    .collection("tenants")
    .doc(companyName)
    .collection("jobs")
    .doc(jobID)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        //console.log('Document data: ', doc.data());
        jobInfo = doc.data();
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
    });
  //console.log("collection Info: ", jobInfo);
  return jobInfo;
}

async function editJob(jobID, jobInfo, companyName) {
  console.log("jobID: ", jobID);
  console.log("jobInfo", jobInfo);
  console.log("companyName", companyName);
  await db
    .collection("tenants")
    .doc(companyName)
    .collection("jobs")
    .doc(jobID)
    .update(jobInfo);
}

module.exports = {
  registerTenant,
  checkCredentials,
  checkEmployeeCredentials,
  registerEmployee,
  getTenantJobs,
  createNewJob,
  deleteJobs,
  addAppliedJob,
  getJobInfo,
  editJob,
  addEmpToTenantEmpArray,
  getTenantEmployees,
};
