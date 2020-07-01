// require firebase admin to use firestore database
const admin = require("firebase-admin");

// initialize the firebase firestore sdk
let serviceAccount = require("../ServiceAccountKey.json");
const { getLogger } = require("nodemailer/lib/shared");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let db = admin.firestore();

function registerTenant(tenant) {
  console.log("registerTenant", tenant.state);
  const tenantUpdate = { ...tenant.state};
  db.collection("tenants").doc(tenant.state.name).set(tenantUpdate);
}

function registerEmployee(employee) {
  console.log("registerEmployee", employee.employee);
  // add employee to employees collection
  db.collection("tenants")
    .doc(employee.employee.tenant)
    .collection("employees")
    .doc(employee.employee.email)
    .set(employee.employee);
}

async function checkCredentials(credentials) {
  var validate = false;
  var user = ""
  var companyName = "";
  let credRef = db.collection("tenants");
  let tenantRef = await credRef.get();

  //check tenants
  await credRef
    .where("email", "==", credentials.email)
    .where("password", "==", credentials.password)
    .get()
    .then((doc) => {
      if (doc.empty) {
        console.log("No matching documents.");
        return;
      }
      console.log(doc);
        user="tenant";
        validate = true;
        companyName = doc.docs[0].data().name;   
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  // check employees
  if(validate === false) {
    for (let tenant of tenantRef.docs) {
      console.log(tenant.id, tenant.data());
      await credRef
      .doc(tenant.id)
      .collection("employees")
      .where("email", "==", credentials.email)
      .where("password", "==", credentials.password)
      .get()
      .then((doc) => {
        user="employee";
        validate = true;
        companyName = tenant.id;
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
      
    }
    console.log("login: ", user);
  }

  return { user, validate, companyName };
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

async function getAppliedWorkers(company, jobID) {
  console.log("getAppliedWorkers for %s %s", company, jobID);
  var appliedWorkers = [];
  var employees_in_tenants_array = [];
  let query = await db
    .collection("tenants")
    .doc(company)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        employees_in_tenants_array = doc.data().employees;
      }
    });
  console.log("%s employees: ", company, employees_in_tenants_array);

  for (let index = 0; index < employees_in_tenants_array.length; index++) {
    let query = await db
      .collection("tenants")
      .doc(company)
      .collection("employees")
      .doc(employees_in_tenants_array[index])
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No document for: ", employees_in_tenants_array[index]);
        } else {
          if (typeof doc.data().appliedJobs !== "undefined") {
            const jobs = doc.data().appliedJobs;
            if (jobs.includes(jobID)) {
              console.log("FOUND WORKER");
              appliedWorkers.push({
                name: doc.data().name,
                surname: doc.data().surname,
                email: doc.data().email,
              });
            }
          }
        }
      });
  }
  /* let applied = await db
    .collection("employees")
    .where("appliedJobs", "array-contains", "Cl0OBNXtaVg0zqvkbkLe").get().then((doc) => {
      if (!doc.exists) {
        console.log("asdfasdf")
      } else {

        console.log(doc.data())
      }
    }); */
  return appliedWorkers;
}

async function getSelectedWorkers(company, jobID) {
  var selectedWorkers = [];
  let query = await db
    .collection("tenants")
    .doc(company)
    .collection("jobs")
    .doc(jobID)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("##################No such document with ID %s", jobID);
      } else {
        console.log("##################", doc.data().selectedWorkers);
        selectedWorkers = doc.data().selectedWorkers;
      }
    });
  console.log("~~: ", await getEmployeesInfo(company, selectedWorkers));
  selectedWorkers = await getEmployeesInfo(company, selectedWorkers);
  return selectedWorkers;
}

async function getEmployeesInfo(company, employeeList) {
  var workersInfoList = [];
  for (let index = 0; index < employeeList.length; index++) {
    let query = await db
      .collection("tenants")
      .doc(company)
      .collection("employees")
      .doc(employeeList[index])
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No document for: ", employeeList[index]);
        } else {
          workersInfoList.push({
            name: doc.data().name,
            surname: doc.data().surname,
            email: doc.data().email,
          });
        }
      });
  }
  return workersInfoList;
}

async function updateSelectedWorkers(company, jobID, action, workers) {
  //console.log(workers);
  let jobRef = db
    .collection("tenants")
    .doc(company)
    .collection("jobs")
    .doc(jobID);

  for (let index = 0; index < workers.length; index++) {
    console.log("--", workers[index].email);
    if (action === "add") {
      // 1) add workers email to job.selectedWorkers
      jobRef.update({
        selectedWorkers: admin.firestore.FieldValue.arrayUnion(
          workers[index].email
        ),
        //selectedWorkers: db.FieldValue.arrayUnion(workerEmails),
      });
      // 2) add jobID to emp.upcommingJobs & remove jobID from emp.appliedJobs
      db.collection("tenants")
        .doc(company)
        .collection("employees")
        .doc(workers[index].email)
        .update({
          upcommingJobs: admin.firestore.FieldValue.arrayUnion(jobID),
          appliedJobs: admin.firestore.FieldValue.arrayRemove(jobID),
        });
    
    } else {
      // 1) remove workers email from job.selectedWorkers
      jobRef.update({
        selectedWorkers: admin.firestore.FieldValue.arrayRemove(
          workers[index].email
        ),
      });
      // 2) remove jobID from emp.upcommingJobs &  add jobID to emp.appliedJobs
      db.collection("tenants")
        .doc(company)
        .collection("employees")
        .doc(workers[index].email)
        .update({
          upcommingJobs: admin.firestore.FieldValue.arrayRemove(jobID),
          appliedJobs: admin.firestore.FieldValue.arrayUnion(jobID),
        });
  
    }
  }
}

async function getTenantEmployees(companyName) {
  var employees = [];

  await db
    .collection("tenants")
    .doc(companyName)
    .collection("employees")
    .get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
          employees.push({
            name: doc.data().name,
            surname: doc.data().surname,
            email: doc.data().email,
            status: "active",
        })
      })
    });

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
  db.collection("tenants")
    .doc(companyName)
    .collection("employees")
    .doc(employeeEmail)
    .update({
      appliedJobs: admin.firestore.FieldValue.arrayUnion(jobReferenceId),
    });
}

async function getAppliedJobs(employeeEmail, companyName) {
  var appliedJobs_array = [];
  var jobs = [];
  let query = await db
    .collection("tenants")
    .doc(companyName)
    .collection("employees")
    .doc(employeeEmail)
    .get()
    .then((doc) => {
      if (doc.exists) {
        appliedJobs_array = doc.data().appliedJobs;
        console.log("Document data:", appliedJobs_array);
      } else {
        console.log("No applied Jobs");
      }
    });

  for (let idx = 0; idx < appliedJobs_array.length; idx++) {
    let query = await db
      .collection("tenants")
      .doc(companyName)
      .collection("jobs")
      .doc(appliedJobs_array[idx])
      .get()
      .then((doc) => {
        jobs.push({ ...doc.data(), id: doc.id });
        console.log(doc.data());
      });
  }
  return jobs;
}


async function cancelAppliedJob(employeeEmail, companyName, jobId) {
  var jobRef = await db.collection("tenants").doc(companyName).collection("employees").doc(employeeEmail);
  jobRef.update({ appliedJobs: admin.firestore.FieldValue.arrayRemove(jobId) });
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
  registerEmployee,
  getTenantJobs,
  createNewJob,
  deleteJobs,
  addAppliedJob,
  getAppliedJobs,
  getJobInfo,
  editJob,
  addEmpToTenantEmpArray,
  getTenantEmployees,
  cancelAppliedJob,
  getAppliedWorkers,
  getSelectedWorkers,
  updateSelectedWorkers,
};
