# Cloud Native Project Documentation

Group: **CloudJB** (Jaromir Charles, Benjamin Herrmann) 

## Table of Contents

1. [Description](#Description)
2. [Application Architecture & Design](#Application Architecture & Design)
3. [Operations](#Operations)
4. [Cost Calculation & Business Model](#Cost Calculation & Business Model)

## Description

The main functionality of our multi-tenancy cloud native application is to allow:

* **tenants** (mainly the personnel managers) of a firm to organize their jobs and workers.
* **employees** to have a complete overview of their tenant's jobs.

A better understanding of the functionality of the application can be seen within the following user cases.

<img src="/home/jaromir/Documents/PMS/documentation/personnel_manager_use_case.png" alt="personnel_manager_use_case" style="zoom:80%;" />

The diagram above depicts the main functionalities of the **tenant**. The tenant has the ability to register his company to use our service. Upon successful registration he/she can log into the system and use its functionalities. One functionality being to invite employees to use the service whereby an email invitation will be sent to that employee via our system. The other functionality available to the tenant is to create, edit and delete jobs.

<img src="/home/jaromir/Documents/PMS/documentation/employee_use_case.png" alt="employee_use_case" style="zoom:100%;" />

The diagram above depicts the main functionality of the user. Upon retrieval of an email invitation, he/she can register to use the PMS service of his/her company. After registration, he/she can log into the system where the employee can then apply and un-apply for desired jobs.



## Application Architecture & Design

#### Components and Interfaces

<img src="/home/jaromir/Documents/PMS/documentation/components_and_interfaces.png" alt="components_and_interfaces" style="zoom:80%;" />

The image above depicts the components and interfaces of the `PMS` application. The application is broken down into two services: the `client` and the `server` both being able to run independently from one another.

The `client` (developed with react JS) entails the User Interface with which the user interacts with. The client runs within a Kubernetes cluster and is visible on port `3000`.

The `server` (a Node JS Express server) serves the frontend with its backend logic. Its REST API handles the requests to be made to the database (cloud firestore) creating updating getting desirable information. The server runs also within the Kubernetes cluster and is visible on port `5000`.

A `Horizontal Auto scale Load balancer` is used to distribute the load over the client pods. The Load balancer runs on port `80` and redirects the incoming traffic to the client pods.



###### Describe how the most important use cases are implemented (dynamic view)

#### Cloud Provider Resources

The application is hosted on `Google Cloud` and therefore we used a number of resources that Google Cloud provides. These resources used will now be discussed:

* **Google Kubernetes Engine**
  * Google's Kubernetes Engine has been used to run the application in a containerized environment. Kubernetes automates deployment, scaling and management of the containerized application.
  * justification: Most of the work is done by Kubernetes. It handles auto up and down scaling when the specified CPU threshold has been reach. It handles the recreation of new pods of one happens to fails.
  * Alternatives: docker
* **Firebase Firestore**
  * The application uses a NoSQL Document store database because of its flexibility. It is more easy to add new "fields" to these documents as to their SQL counterparts. This makes implementation a lot easier and also makes it more flexible to configure different fields for different tenants. A NoSQL database also enables easier continuous integration.
  * Alternatives
* **Container Registry**
  * Google Cloud's Container Registry has been used to store manage and secure our docker container images. The application images how ever need to be available for Kubernetes, so that Kubernetes knows where to get it images to be used to create pods.
  * justification: images are secure and private
  * alternatives: docker hub could also be used to store our images, but we want our image to be private
* **Compute Engines**
  * Google's Compute engines are being used indirectly, as the Kubernetes cluster creates virtual machines for us to run the application.

#### The five essential characteristics of a cloud service [see](https://www.controleng.com/articles/five-characteristics-of-cloud-computing/)

1. `On-demand self-service`
   
   1.  A consumer can unilaterally provision computing capabilities, such as server time and network storage, as needed automatically without requiring human interaction with each service provider.
2. `Broad network access`
   
   1. Capabilities are available over the network and accessed through standard mechanisms that promote use by heterogeneous thin or thick client platforms (e.g., **[mobile](https://www.govinfosecurity.com/mobility-c-212)** phones, tablets, laptops and workstations).
   
   The Load balancer which was set up gives our application an public external ip address which allows all users to access our service at any time from anywhere from any device which is connected to the Internet.
3. `Resource pooling`
   
   1. The provider's computing resources are pooled to serve multiple consumers using a multi-tenant model, with different physical and virtual resources dynamically assigned and reassigned according to consumer demand. There is a sense of location independence in that the customer generally has no control or knowledge over the exact location of the provided resources but may be able to specify location at a higher level of abstraction (e.g., country, state or datacenter). Examples of resources include storage, processing, memory and network bandwidth.
   
   Resources are shared whereby the application is accessiable to all tenants and users under the same ip address. The load balancer handles the request by up and down scaling the number of pods to be ran.  Our storage database is shared by all tenants and users. The cpu processing is shared where by when a threshold is reached, new pods will spin up.
4. `Rapid elasticity`
   
   1. Capabilities can be elastically provisioned and released, in some cases automatically, to scale rapidly outward and inward commensurate with demand. To the consumer, the capabilities available for provisioning often appear to be unlimited and can be appropriated in any quantity at any time.
   
   A Horizontal Pod Autoscaler object has been created which targets the client deployment which periodically adjusts the number of replicas of the scale target to match the average CPU utilization which was specified to 80%. A maximum of 5 replicas has been set and a minimum to 1, with a cpu utilization of 80%.
   
   To achieve rapid elasticity, a Load Balancer has been set up on both client and server which will scale up when the user demands increase. The Load Balancer will also scale down if the resources are not utilized by the consumers.
   
   Load Balancer? The load balancer allows us to scale up when a lot of requests come in and scale down when the requests retreat.
5. `Measured Service`
   
   1. Cloud systems automatically control and optimize resource use by leveraging a metering capability at some level of abstraction appropriate to the type of service (e.g., storage, processing, bandwidth and active user accounts). Resource usage can be monitored, controlled and reported, providing transparency for the provider and consumer.
   
   **WE dont have this**

#### Describe how multi-tenancy is implemented



<img src="/home/jaromir/Documents/PMS/documentation/database_model.png" alt="database_model" style="zoom:80%;" />



Multi-tenancy is achieved with our database model. This means we had to put a great deal of effort into ensuring that no data is being leaked. The database separates the data on a tenant level. This means that within our collection, each tenant has its own document, its own name-space. And within each tenant's document, the tenant's jobs and employees and other fields are stored, making this information only visible for said tenant.

To ensure that no information is being leaked to the wrong tenant or employee, each request made contains the respective tenant's name when making requests on company level as well as the employee's email when making employee requests.

###### Describe why your application is cloud native, does it implement the 12F?

The application implements the twelve cloud native factors. **(1)** The application's `Codebase` is hosted on GitHub

## Operations

### Adding a new tenant

### Installing application on the cloud provider

### DevOps approach
As a team of 2 developers, we utilized `GitHub` to manage the changes made to the source code as well as for collaboration. To keep track of what needs to be done within the project, we used GitHubs project boards so that the team has an overview of what needs to be done, what is currently in progress, what needs to be reviewed and what has already been done. **INSERT PICTURE??**.



## Cost Calculation & Business Model



---

**Tenant: Register, unregister to PMS**

*As a tenant I would like to register/unregister my company to PMS.*

<u>Acceptance Criteria:</u>

1. Possibility to register my company to use PMS's services.
2. Possibility to unregister my company to no longer use PMS's services.

---

**Tenant: Invite workers**

*As a Tenant I would like to invite workers to join the company's "worker group" and also have an overview of the invited workers status.*

<u>Acceptance Criteria:</u>

1. Text field to enter email addresses
2. Invite button to send invitation to the entered email addresses
3. A view of all workers as well as their invitation status, accepted or request pending.

---

**Tenant: Create job**
*As a Tenant I would like to be able to create a new job listing., in order to add the job to the system as well as for the employees to be able to apply for the new job.*
<u>Acceptance criteria:</u>

1. Creating a job is done with the click of a button `Create Job`.
   1. The ability to add the jobs title, location, description, start & end time, number of workers required.
2. The ability to either `Save` or `Cancel` creating the job.
3. The newly created job will appear in the list of jobs.

---

**Tenant: View and edit jobs**

*As a Tenant I would like to see a list of all jobs, in order to have an overview of my company's jobs.*

<u>Acceptance criteria:</u>

1. A list view of all jobs.
2. The ability to edit a job's information by clicking on the respective edit icon

---

**Tenant: Delete Job Listing**

*As a Tenant I would like to delete a job listing, so that employees can no longer apply for the job.*

<u>Acceptance criteria:</u>

1. The ability to check mark a job and delete it.
2. The deleted job is no longer in the list of jobs.

---

<img src="/home/jaromir/MSI/CAD/tenant.png" alt="tenant" style="zoom:50%;" />

---

**Tenant: View and accept applicants**

*As a Tenant I would like to see which employees applied for which job, so that i can create a team to partake in the job.*

<u>Acceptance criteria:</u>

1. Each row in the job listing gets a new field named `Members`
   1. Example the field will show `5/7` meaning 5 people applied from needed 7 workers.
2. When job is clicked, redirected to another page with the job's information and two lists with `applied` and `selected` workers.
3. The ability to move the workers between both `applied` and `selected` workers list.

---

**Employee: Join Tenant's PMS service, edit profile**

*As an Employee I would like to accept my companies invite to use PMS's services, as well as to edit my profile information.*

<u>Acceptance criteria:</u>

1. Fill out profile information with name, address, phone number, insurance number
2. View and edit profile information.

---

**Employee: Available Job list**

*As an Employee I would like to see a list of all available jobs my employing company currently has and the ability to click on them to see all the information, in order to apply for jobs.*

<u>Acceptance criteria:</u>

1. See a list of all available jobs under `Available jobs`.
2. The ability to click on the job's title and see the full job's information.
3. The ability to apply for a job with an `Apply` button.
   1. This job will no longer be shown under the `Available jobs` list.

---

**Employee: Applied Job list**

*As an Employee I would like to see a list of all the jobs I applied to, in order to have a separate overview between all jobs and my applied jobs.*

<u>Acceptance criteria:</u>

1. A view `Applied Jobs`
   1. This view contains all the jobs that were applied to in the `Available jobs` list section.
2. The ability to cancel a job application with a `cancel` button.

---

**Employee: Accepted Job list**

*As an Employee I would like to see a list of all the jobs i got accepted to, in order to know my upcoming jobs.*

<u>Acceptance criteria:</u>

1. A view `Upcoming Jobs`.
   1. View shows the upcoming jobs along with the jobs information.
2. The ability to `cancel` a job application with a `cancel` button.

## 