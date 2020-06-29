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



## Deploying PMS on a Google Kubernetes Engine (GKE) cluster

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

