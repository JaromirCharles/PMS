# REST API Documentation

* `/api/tenant_applied_workers`
    * retrieves the applied workers for a specific job ID
    
    * ```javascript
      const data = await fetch("/api/tenant_applied_workers", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ companyName, jobID }),
      });
      ```
    * server calls `firestore.getAppliedWorkers(tenant, jobID)` which returns a list [name: "jane", surname: "doe", email: "janedoe@gmail.com"] of workers who applied for the specific job.

* `api/tenant_selected_workers`

  * retrieves the selected workers for a specific job ID

  * ```javascript
    const data = await fetch("api/tenant_selected_workers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName, jobID }),
    });
    ```





## Useful firebase firestore expressions

* **Update array field in document**

  * ```sql
    db.collection("...").doc("...").update({field_key: admin.firestore.FieldValue.arrayUnion(new_field_value)});
    ```

* **Remove element from array**

  * ```sql
    db.collection("..:").doc("...").update({field_key: admin.firestore.FieldValue.arrayRemove(field_value)});
    ```

    