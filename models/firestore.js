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
      .update({employees: admin.firestore.FieldValue.arrayUnion(employee.employee.email)});
}

async function checkCredentials(credentials) {
  var validate = false;
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
        } else {
          validate = false;
        }
      });
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
  return validate;
}

module.exports = { registerTenant, checkCredentials, registerEmployee };
