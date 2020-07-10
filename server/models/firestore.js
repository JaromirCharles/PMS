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
  let registrationSuccesfull = true;
  let retMsg = "";

  // check if email address already within system. If yes return error
  await db
    .collection("login")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No documents in collection login");
        return;
      }
      snapshot.forEach((login) => {
        if (login.id === tenant.tenant.email) {
          retMsg = "Email already exists";
          registrationSuccesfull = false;
        }
      });
    });
  if (!registrationSuccesfull) {
    return [registrationSuccesfull, retMsg]
  }

  await db
    .collection("tenants")
    .doc(tenant.tenant.name)
    .set({ email: tenant.tenant.email, employees: [] })
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

    db.collection("login")
      .doc(tenant.tenant.email)
      .set({
        tenant: tenant.tenant.name,
        password: hash,
        user: "tenant",
      })
      .then(function () {
        registrationSuccesfull = true;
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
        registrationSuccesfull = false;
      });
  });
  return [registrationSuccesfull, retMsg];
}

function registerEmployee(employee, tenant, password) {

  db.collection("tenants")
    .doc(tenant)
    .collection("employees")
    .doc(employee.email)
    .set(employee);

  db.collection("tenants")
    .doc(tenant)
    .update({
      pendingInvitations: FieldValue.arrayRemove(employee.email)
   });
  
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      throw err;
    }
    db.collection("login")
      .doc(employee.email)
      .set({
        tenant: tenant,
        password: hash,
        user: "employee",
      })
      .then(function () {
        // NOP
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

  await db
    .collection("login")
    .doc(credentials.email)
    .get()
    .then((doc) => {
      if (doc.empty) {
        console.log("No matching documents.");
        return;
      }
      if (bcrypt.compareSync(credentials.password, doc.data().password)) {
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

  let query = await db
    .collection("tenants")
    .doc(companyName)
    .collection("jobs")
    .get();

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
        jobs.push({ ...job.data(), id: job.id });
      });
    })
    .catch((err) => {
      console.log("getTenantJobs: Error getting documents", err);
    });
  return jobs;
}

async function getAvailableJobs(employeeEmail, companyName) {
  availableTenantJobs = await getTenantJobs(companyName);
  appliedJobs = await getAppliedJobs(employeeEmail, companyName);
  upcomingJobs = await getUpcomingJobs(employeeEmail, companyName);

  appliedJobsIDs = appliedJobs.map((j) => j.id);
  upcomingJobsIDs = upcomingJobs.map((j) => j.id);

  myArray = availableTenantJobs.filter((el) => !appliedJobsIDs.includes(el.id));
  myArray = myArray.filter((el) => !upcomingJobsIDs.includes(el.id));

  return myArray;
}

async function addEmpToTenantEmpArray(tenant, email) {
  await db
    .collection("tenants")
    .doc(tenant)
    .update({
      pendingInvitations: admin.firestore.FieldValue.arrayUnion(email),
    });
}

async function getAppliedWorkers(company, jobID) {
  var appliedWorkers = [];

  let jobRef = await db
    .collection("tenants")
    .doc(company)
    .collection("employees")
    .where("appliedJobs", "array-contains", jobID)
    .get();

  for (applWorker of jobRef.docs) {
    appliedWorkers.push({
      name: applWorker.data().name,
      surname: applWorker.data().surname,
      email: applWorker.data().email,
    });
  }

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
        console.log("No such document with ID %s", jobID);
      } else {
        selectedWorkers = doc.data().selectedWorkers;
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
  let jobRef = db
    .collection("tenants")
    .doc(company)
    .collection("jobs")
    .doc(jobID);

  for (let index = 0; index < workers.length; index++) {
    if (action === "add") {
      // 1) add workers email to job.selectedWorkers
      jobRef.update({
        selectedWorkers: admin.firestore.FieldValue.arrayUnion(
          workers[index].email
        ),
        //selectedWorkers: db.FieldValue.arrayUnion(workerEmails),
      });
      // 2) add jobID to emp.upcomingJobs & remove jobID from emp.appliedJobs
      db.collection("tenants")
        .doc(company)
        .collection("employees")
        .doc(workers[index].email)
        .update({
          upcomingJobs: admin.firestore.FieldValue.arrayUnion(jobID),
          appliedJobs: admin.firestore.FieldValue.arrayRemove(jobID),
        });
    } else {
      // 1) remove workers email from job.selectedWorkers
      jobRef.update({
        selectedWorkers: admin.firestore.FieldValue.arrayRemove(
          workers[index].email
        ),
      });
      // 2) remove jobID from emp.upcomingJobs &  add jobID to emp.appliedJobs
      db.collection("tenants")
        .doc(company)
        .collection("employees")
        .doc(workers[index].email)
        .update({
          upcomingJobs: admin.firestore.FieldValue.arrayRemove(jobID),
          appliedJobs: admin.firestore.FieldValue.arrayUnion(jobID),
        });
    }
  }
}

async function getTenantEmployees(companyName) {
  
  var employees = [];
  var pendingEmployeesArray = [];

  // get active employees
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

  // get employees with still pending invitation
  await db
  .collection("tenants")
  .doc(companyName)
  .get()
  .then((doc) => {
    pendingEmployeesArray = doc.data().pendingInvitations;
  });

  pendingEmployeesArray.map(function(empl) {
    employees.push({name: "", surname: "",email: empl, status: "request pending"});
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

  return retVal;
}

async function deleteJobs(jobs) {
  jobs.deleteJobList.deleteJobList.forEach((job) => {
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
      } else {
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
        upcomingJobs_array = doc.data().upcomingJobs;
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

  return getAppliedJobs(employeeEmail, companyName);
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
        jobInfo = doc.data();
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
    });
  return jobInfo;
}

async function editJob(jobID, jobInfo, companyName) {
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
