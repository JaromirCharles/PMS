# Kubernetes

Container deployment allows an application level separation. Different containers run on the same machine. 

Kubernetes is an open-source system for automating deployment, scaling and management of containerized applications. Google Kubernetes Engine (GKE). Kubernetes is the standard for running containerized applications.

#### Features of Kubernetes

* Automating deployment, scaling and management of containerized applications (one of the properties of **cloud native** applications)
* Supports any container runtime environment
* Service discovery and load balancing
* Automated rollbacks and rollouts
* Self healing - if one application fails, it restarts automatically

#### Main Concepts

* A Kubernetes cluster consists of two types of resources:
  * The **Kubernetes Control Pane** (master node) which coordinates the cluster. Provided by the cloud provider.
  * **Nodes** are the workers that run the applications (VM or physical machine which serves as worker machine)

#### Kubernetes Pods

* A **Pod** is a Kubernetes abstraction that represents a group of one or more application containers (such as Docker) and some shared resources for those containers. Containers run on pods. A Pod always run on a node. 

#### Controllers

* In Kubernetes, controllers are control loops that watch the state of your application, then make or request changes where needed.

#### Deployment

* The commandline tool **kubectl** is used to control the cluster
  * kubectl communicates via Kubernetes API with the nodes.
* Example for deploying a container:
  * kubectl run kubernetes-bootcamp --image=docker.io/jocatalin/kubernetes-bootcamp:v1 --port=8080
  * **Requirements** - the docker image needs to be uploaded to the container registry.



#### Deployment in Google Cloud Kubernetes

* build docker image
* upload docker image to Google Docker Registry
* create cluster
* deploy application
* publish app
* scale app
* update app
* clean up
* [example](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app)

###### Steps

* Step 1: create docker image
  * PROJECT id is name of Google project, then name of image, then version number of image
  * `docker build -t gcr.io/${PROJECT_ID}/hello-app:v1 .`
* Step 2: push image to Google central registry
  * `gcloud config set project <project name>` - set the project i'm working with
  * `gcloud auth configure-docker` - to configure Google cloud environment
  * `gcloud config list` - see config information
  * `docker push gcr.io/${PROJECT_ID}/hello-app:v1`
  * goto Google cloud platform then to `container registry` which will show all the docker images
* Step 3: create a GKE cluster
  * To see the clusters go to Google cloud platform then kubernetes engine then clusters
  * tell kubernetes to connect to the cluser:
    * `gcloud container clusters get-credentials ...`
  * under `workloads` one could see what is running on the cluster
* Step 4: Deploy app to GKE (53:00 in video) [see for more info from kubernetes doc](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
  * To deploy an app, you will need a deploy file. a yaml file. This specifies how the application should be deployed.
    * execute with: `kubectl create -f <file_name.yaml>`
  * `kubectl cluster-info` displays information about the running cluster
  * `kubectl get deployments ` - watch which deployments are up and running
  * `kubectl get pods -o wide` - show the pods that are running
  * expose pods to the outside: see next step
* Step 5: The pods are not available to the outside. To access them via the internet, we need to expoose the pods. To do this we need to use kubernetes [services ](https://kubernetes.io/docs/concepts/services-networking/service/).  pods are low level just running application container. to give them external ip address and load balancer, then we need to create a service. For each application we have to create a service. which is also defined in a yaml file. (1:03:00 video). the selector says to which pod the load balancer should connect.
  * `kubectl create -f <service_file_name.yaml>`
  * `kubectl get service` - to see the services
* Step 6: scale app by adding pods
  * `kubectl get pods` shows the number of pods
  * `kubectl scale deployment app name --replicas=3` scale up to three replicas
  * return `kubectl get pods` 

* Step 7: Deploy a new version of the application/docker container
  * create the container again with dockerbuild and a new version
    * `docker build -t gcr.io/project_id/app_name:v2 .`
  * push the image to the container registry
    * `docker push gcr.io/project_id/app_name:v2`
  * apply rolling update to the existing deployment with an image update
    * `kubectl set image deployment/name name=gcr.io...` (1:16:20) in video
* [domain name](https://cloud.google.com/kubernetes-engine/docs/tutorials/configuring-domain-name-static-ip)



## Deploying PMS on a Google Kubernetes Engine (GKE) cluster (followed [this guide](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app#console))

* Install the Google Cloud SDK. [See](https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu)
* Install the Kubernetes command-line tool. `kubectl` is used to communicate with Kubernetes.
  * `gcloud components install kubectl`

###### Step 1: Build the container image.

* Set the PROJECT_ID environment variable to your Google Cloud project ID. The PROJECT_ID will be used to associate the container image with your projects Container Registry. PMS ID - `apt-momentum-279610`
  * `export PROJECT_ID=apt-momentum-279610`
* Build and tag the Docker image for pms
  * `sudo docker build -t gcr.io/${PROJECT_ID}/pms:v1 .`
    * The `gcr.io` prefix refers to [Container Registry](https://cloud.google.com/container-registry), where the image will be hosted.
    * Remove old containers with: `sudo docker rm <container_name>`
    * Remove old images with `sudo docker image rm <image_id>`

###### Step 2: Test container image using local docker engine

* `sudo docker run --rm -p 3000:3000 gcr.io/${PROJECT_ID}/pms:v1`

###### Step 3: Push the Docker image to Container Registry

* One needs to upload the container image to a registry so that your GKE cluster can download and run it.

  * Configure the Docker command-line tool to authenticate to Container Registry:

    * `gcloud config set project apt-momentum-279610` - set Google project
    * `gcloud auth configure-docker`

  * Push the Docker image to the Container Registry

    * `sudo docker push gcr.io/${PROJECT_ID}/pms:v1` (takes minutes...)

    * ```
      unauthorized: You don't have the needed permissions to perform this operation, and you may have invalid credentials. To authenticate your request, follow the steps in: https://cloud.google.com/container-registry/docs/advanced-authentication
      ```

      * executed `sudo usermod -a -G docker ${USER}` then restart pc
    
  * goto Google cloud platform then to `container registry` which will show all the docker images.

###### Step 4: Create a GKE cluster

Now that the Docker image is stored in Container Registry, you need to create a GKE cluster to run pms. A GKE cluster consists of a pool of Compue Engine VM instances running Kubernetes.

* `gcloud config set compute/zone europe-west3` - set compute engine zone for gcloud tool
* Create a cluster named pms-cluster
  * `gcloud container clusters create pms-cluster`
    * **DID NOT WORK**
  * Did it via the Console
    * **WORKED**

###### Step 5: Deploy the sample app to GKE

Now we can deploy the docker image we built to the GKE cluster. Kubernetes represents applications as Pods, which are scalable units holding one or more containers. We will create a Kubernetes Deployment to run `pms` on the cluster. The deployment will have 3 replicas(pods). One deployment pod will contain only one container, the pms application docker image. We will also create a HorizonalPodAutoscaler resource that will scale the number of Pods from 3 to a number between 1 and 5, based on CPU load.

* **Prof had a yaml file. Check that out**

* Create a Kubernetes Deployment for the pms Docker image

  * `kubectl create deployment pms --image=gcr.io/${PROJECT_ID}/pms:v1`

    * ```
      error: failed to discover supported resources: Get http://localhost:8080/apis/apps/v1?timeout=32s: dial tcp 127.0.0.1:8080: connect: connection refused
      ```

      * FIX: `gcloud container clusters get-credentials pms-cluster --zone europe-west3-a`

* Set the baseline number of Deployment replicas to 3

  * `kubectl scale deployment pms --replicas=3`

* Create a HorizontalPodAutoscaler resource for your deployment

  * `kubectl autoscale deployment pms --cpu-percent=80 --min=1 --max=5`

* To see the pods created, run the following command

  * `kubectl get pods`

###### Step 6: Expose the pms app to the internet

While pods do have individually-assigned Ip addressed, those IPs can only be reached from inside your cluster. Also, GKE Pods are designed to be ephemeral(lasting for a very short time), spinning up or down based on scaling needs. We need a way to `1)` group pods together into one static hostname, and `2)` expose a group of Pods outside the cluster, to the internet. Kubernetes Services solve for both these problems. Services group Pods into one static IP address, reachable from any Pod inside the cluster. GKE also assigns a DNS hostname to that static IP. To expose a Kubernetes Service outside the cluster, you will create a service of type **LoadBalancer**. This type of Service spawns an External Load balancer IP for a set of Pods, reachable via the internet.

* Use the kubectl expose command to generate a Kubernetes Service for the pms deployment
* **Prof had a yaml file. Check that out**
  * `kubectl expose deployment pms --name=pms-service --type=LoadBalancer --port 80 --target-port 3000`
    * Here, the `--port` flag specifies the port number configured on the Load Balancer, and the `--target-port` flag specifies the port number that the `pms` app container is listening on.

* Run the following command to get the Service details for `pms-service`
  * `kubectl get service`
    * Copy the `EXTERNAL-IP` address

Now the `pms` pods are exposed to the internet via a Kubernetes Service.

###### Step 7: Deploy a new version of the pms app

One could upgrade the app to a new version by building and deploying a new Docker image to your GKE cluster. GKE's rolling update feature allows you to update your Deployments without downtime. During a rolling update, your GKE cluster will incrementally replace the existing `pms` Pods with Pods containing the Docker image for the new version. During the update, your load balancer service will route traffic only into available Pods.

1. Build and tag a new `pms` Docker image.
   1. `docker build -t gcr.io/${PROJECT_ID}/pms-client:v2`
2. Push the image to Container Registry
   1. `docker push gcr.io/${PROJECT_ID}/pms-client:v2`
3. Now one is ready to update the `app` Kubernetes Deployment to use a new Docker image
   1. Apply a rolling update to the existing deployment with an image update
      1. `kubectl set image deployment/pms-client pms-client=gcr.io/${PROJECT_ID}/pms-client:v2`
   2. 
4. [continue here](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app#cloud-shell_3)

###### [Configuring Domain Names with Static IP Addresses](https://cloud.google.com/kubernetes-engine/docs/tutorials/configuring-domain-name-static-ip)





---

The main unit of work for Kubernetes is a [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/). The simplest way of thinking about a Pod is like a physical server or virtual machine. A Pod can host one or many containers. A microservice application might consist of a number of pods, two in our case – a ‘backend’ and a ‘frontend’. These pods need to know about each other in order for them to communicate, and the way they do this is through a Service.

A Deployment on the other hand provides a declarative state for our Service. Deployments control our Services, updating them if they need to be, as well as providing a Service with ‘what’ it needs to deploy.

**Containers in the same Docker network can talk to each other by their names.** This is made possible by a built-in DNS mechanism.

Each component, or "microservice", should be scalable independently.

 Deployment creates and runs containers and keeps them alive.

Service discovery is a critical Kubernetes concept.

**Pods within a cluster can talk to each other through the names of the Services exposing them.**

Kubernetes has an internal DNS system that keeps track of domain names and IP addresses.



**To be scalable, applications must be stateless.**

Stateless means that an instance can be killed restarted or duplicated at any time without any data loss or inconsistent behaviour.

*You must make your app stateless before you can scale it.*

"proxy": "http://localhost:5000/"



```
# Docker Image which is used as foundation to create a 
# custom Docker Image with this Dockerfile
FROM node:current-slim

# A directory within the virtualized Docker environment
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to Docker environment
COPY package.json yarn.lock ./

# Installs all node packages
RUN npm install

# Copies everything over to Docker environment
COPY . .

# Uses port which is used by the actual application
EXPOSE 3000 5000

ENV ENV REACT_APP_baseAPIURL=35.198.102.247:31800

# Finally runs the application
CMD [ "npm", "start"]

```

```
# Docker Image which is used as foundation to create a 
# custom Docker Image with this Dockerfile
FROM node:current-slim as pms-app-build

# A directory within the virtualized Docker environment
WORKDIR /client

# Copies package.json and package-lock.json to Docker environment
COPY package.json yarn.lock ./


RUN yarn

# Copies everything over to Docker environment
COPY ./public ./public

COPY ./src ./src

# Uses port which is used by the actual application
#EXPOSE 3000 5000

ENV ENV REACT_APP_baseAPIURL=35.198.102.247:31800

RUN yarn build

FROM nginx:latest

LABEL maintainer=CloudJB

COPY --from=pms-app-build /client/build/ /usr/share/nginx/html

EXPOSE 80

```

http://35.198.102.247:5000