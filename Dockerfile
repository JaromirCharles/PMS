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
