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