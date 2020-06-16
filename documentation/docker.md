# Docker integration into application

* First create a Dockerfile which will specify how to build the image needed for the application:

  * ```dockerfile
    # Use node
    FROM node:current-slim
    
    # Set the working directory.
    WORKDIR /usr/src/app
    
    RUN npm install -g nodemon
    
    # Copy the file from your host to your current location.
    COPY package.json .
    
    # Run the command inside your image filesystem.
    RUN npm install
    
    # Inform Docker that the container is listening on the specified port at runtime. 
    EXPOSE 3000
    CMD [ "yarn", "dev" ]
    
    # Copy the applications source code, see .dockerignore for excluded files
    COPY . .
    ```

* execute `docker build --tag pms:1.0 .` to build an image from the Dockerfile

  * `--tag` names and tags the image with the `name:tag` format

* After successfully building the image, one should see the following output: *The `pms` image and the `node` image are of importance:*

* ```shell
  $ docker image ls
  REPOSITORY               TAG                 IMAGE ID            CREATED             SIZE
  pms                      1.0                 268f0b61d1fb        5 seconds ago       475MB
  bulletinboard            1.0                 2265da02b62e        2 days ago          182MB
  node                     current-slim        0e2e78467169        7 days ago          165MB
  docker/getting-started   latest              3c156928aeec        8 weeks ago         24.8MB
  hello-world              latest              bf756fb1ae65        5 months ago        13.3kB
  ```

* Run the container with the following command

  * ```shell
    $ sudo docker run --publish 3000:3000 --detach --name pms pms:1.0
    ```

    * `--publish 3000:3000` maps the localhost's port to the container's port.
    * `--detach` runs the container in the background.
    * `--name` assigns a name to the container.
    * `pms:1.0` the image to run.

  * ```shell
    $ docker ps --all
    CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS                  PORTS                    NAMES
    45ff1cb3ef38        pms:1.0                  "docker-entrypoint.s…"   30 seconds ago      Up 29 seconds           0.0.0.0:3000->3000/tcp   pms
    2e19c02c5397        docker/getting-started   "nginx -g 'daemon of…"   29 minutes ago      Up 29 minutes           0.0.0.0:80->80/tcp       friendly_ganguly
    dfdfac4390ba        hello-world              "/hello"                 2 days ago          Exited (0) 2 days ago                            dreamy_pare
    ```

* Access application via `localhost:3000`

* Stop container from running with `docker stop pms`