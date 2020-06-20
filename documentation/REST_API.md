# REST API Documentation

* `/api/tenant_applied_workers`
    * retrieves the applied workers for a specific job ID
    * ```javascript
    const data = await fetch("/api/tenant_applied_workers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({companyName, jobID})
    });
    ```
    * server calls `firestore.getAppliedWorkers(tenant, jobID)` which returns a list [name: "jane", surname: "doe", email: "janedoe@gmail.com"] of workers who applied for the specific job.
