// require firebase admin to use firestore database
const admin = require("firebase-admin");

// initialize the firebase firestore sdk
let serviceAccount = require("../ServiceAccountKey.json");
const { getLogger } = require("nodemailer/lib/shared");
const bcrypt = require("bcrypt");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let db = admin.firestore();

async function registerTenant(tenant) {
  let registrationSuccesfull = false;
  console.log("registerTenant", tenant);
  console.log("password", tenant.password);

  await db
    .collection("tenants")
    .doc(tenant.tenant.name)
    .set({ email: tenant.tenant.email })
    .then((doc) => {
      registrationSuccesfull = true;
    })
    .catch((err) => {
      registrationSuccesfull = false;
    });

  bcrypt.hash(tenant.password, 10, function (err, hash) {
    if (err) {
      throw err;
    }
    console.log("Your hash: ", hash);

    db.collection("login")
      .doc(tenant.tenant.email)
      .set({
        tenant: tenant.tenant.name,
        password: hash,
        user: "tenant",
      })
      .then(function () {
        console.log("Document successfully written!");
        registrationSuccesfull = true;
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
        registrationSuccesfull = false;
      });
  });
  console.log("returning: ", registrationSuccesfull);
  return registrationSuccesfull;
}

function registerEmployee(employee, password) {
  console.log("registerEmployee", employee.employee);
  // add employee to employees collection
  db.collection("tenants")
    .doc(employee.tenant)
    .collection("employees")
    .doc(employee.email)
    .set(employee);

  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      throw err;
    }
    console.log("Your hash: ", hash);

    db.collection("login")
      .doc(employee.email)
      .set({
        tenant: employee.tenant,
        password: hash,
        user: "employee",
      })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  });
}

async function checkCredentials(credentials) {
  var validate = false;
  var user = "";
  var companyName = "";
  
  /* ----- for testing create employee
  const employee = {
    name: "Jaromir",
    surname: "Charles",
    email: "jaromircharles@hotmail.com",
    tenant: "Hotchocolates",
  };
  const passe = {
    passe: "admin",
  };
  registerEmployee(employee, passe.passe)
  */


  await db
    .collection("login")
    .doc(credentials.email)
    .get()
    .then((doc) => {
      if (doc.empty) {
        console.log("No matching documents.");
        return;
      }
      console.log("check Credentials:");
      console.log(credentials.password);
      console.log(credentials.email);
      console.log(doc.data());


      if (bcrypt.compareSync(credentials.password, doc.data().password)) {
        console.log("in here jeee");
        validate = true;
        companyName = doc.data().tenant;
        user = doc.data().user;
      } else {
          // Passwords don't match
      }
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  return { user, validate, companyName };
}

async function getTenantJobs(companyName) {
  var jobs = [];
  console.log("getting jobs for: ", companyName);
  let query = await db
    .collection("tenants")
    .doc(companyName)
    .collection("jobs")
    .get();

  console.log("jobs: ", query);

  await db
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

async function getAvailableJobs(employeeEmail, companyName) {
  availableTenantJobs = await getTenantJobs(companyName);
  appliedJobs = await getAppliedJobs(employeeEmail, companyName);
  upcomingJobs = await getUpcomingJobs(employeeEmail, companyName);

  appliedJobsIDs = appliedJobs.map(j => j.id);
  upcomingJobsIDs = upcomingJobs.map(j => j.id);

  myArray = availableTenantJobs.filter( ( el ) => !appliedJobsIDs.includes( el.id ) );
  myArray = myArray.filter( ( el ) => !upcomingJobsIDs.includes( el.id ) );

  return myArray;
}

async function addEmpToTenantEmpArray(tenant, email) {
  await db.collection("tenants")
      .doc(tenant)
      .update({
          employees: admin.firestore.FieldValue.arrayUnion(email),
      });
}

async function getAppliedWorkers(company, jobID) {
  var appliedWorkers = [];

  let jobRef = await db
  .collection("tenants")
  .doc(company)
  .collection("employees")
  .where("appliedJobs",  "array-contains", jobID)
  .get();
  
  for(applWorker of jobRef.docs) {
    appliedWorkers.push({
      name: applWorker.data().name,
      surname: applWorker.data().surname,
      email: applWorker.data().email,
    });
  }
  console.log(appliedWorkers);
  
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
      console.log("ooooooooooooooooooo")
      console.log(company)
      console.log(jobID)
      if (!doc.exists) {
        console.log("##################No such document with ID %s", jobID);
      } else {
        console.log("##################", doc.data());
        selectedWorkers = doc.data();
      }
    });

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
        });
      });
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

async function getUpcomingJobs(employeeEmail, companyName) {
  var upcomingJobs_array = [];
  var jobs = [];
  let query = await db
    .collection("tenants")
    .doc(companyName)
    .collection("employees")
    .doc(employeeEmail)
    .get()
    .then((doc) => {
      if (doc.exists) {
        upcomingJobs_array = doc.data().upcommingJobs;
        console.log("upcommingJobs:", upcomingJobs_array);
      } else {
        console.log("No applied Jobs");
      }
    });

  for (let idx = 0; idx < upcomingJobs_array.length; idx++) {
    let query = await db
      .collection("tenants")
      .doc(companyName)
      .collection("jobs")
      .doc(upcomingJobs_array[idx])
      .get()
      .then((doc) => {
        jobs.push({ ...doc.data(), id: doc.id });
        console.log(doc.data());
      });
  }
  return jobs;
}

async function cancelAppliedJob(employeeEmail, companyName, jobId) {
  var jobRef = await db
    .collection("tenants")
    .doc(companyName)
    .collection("employees")
    .doc(employeeEmail);
  jobRef.update({ appliedJobs: admin.firestore.FieldValue.arrayRemove(jobId) });

  return getAppliedJobs(employeeEmail, companyName)
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
  getUpcomingJobs,
  getAvailableJobs,
};
