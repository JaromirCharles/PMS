[![Build Status](https://travis-ci.com/JaromirCharles/PMS.svg?token=hAqcc48iGSUheLvmXpJx&branch=dev)](https://travis-ci.com/JaromirCharles/PMS)

# PMS
Personnel Management System Cloud Application for the Lecture Cloud Application Development.

## Cloning Project
* `git clone git@github.com:JaromirCharles/PMS.git`
* execute `yarn dev` within root folder
  * `yarn dev` starts the frontend as well as the backend server
    * frontend runs on port `3000`
    * backend runs on port `5000`
  * If `yarn dev` indicates missing modules, execute `npm install` within the frontend folder then `npm start`

## Development System

* `npm -version` 6.14.4
* `yarn version` 1.22.4
* `java version` 11.0.7

## Project Setup

The projects User Interface is build with React. The frontend folder has created with `npx create-react-app`.

```shell
:~$ cd PMS
:~/PMS$ npx create-react-app frontend
```

The project has a node express server as its backend serving all REST API requests.

To start the application, run `yarn dev` which launches the application on `http://localhost:8080`. Currently a default username `admin` and password `admin` can be used to accept the system.

Development is done using `Visual Studio Code` and `Firefox`.

* Visual Studio Code
  * Provides useful React extensions
    * [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) Code formatter using prettier
    * [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets) Code snippets for JavaScript in ES6 syntax
    * [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) Simple extensions for React, Redux and Graphql in JS/TS with ES7 syntax
* Firefox
  * The [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) have been downloaded for a better development experience.



## Application Setup 

* `React Router Dom` is used to route through the different pages. Install with `npm install --save react-router-dom`.
* `Material-UI` is used to design the system. Install Material-UI's source files with `npm install --save @material-ui/core`.
  * `Material-UI` offers over 1000+ icons. Install with `npm install --save @material-ui/icons`
  * npm i @material-ui/pickers

* [bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/). 

* `axios` promised based HTTP client to interact with the REST API. Install with `npm install --save axios`

* Express is an opinionated NodeJS framework for web-applications. It provides the building blocks you'll need to setup a web-server capable of receiving and responding to HTTP requests.

* React is a JS library for building user interfaces. It doesn't handle HTTP requests at all.

* React Router is a library for react which provides declarative routing for the interface.

* send emails with [Nodemailer](https://nodemailer.com/about/)
  * install the node mailer module using npm `npm install nodemailer`
  * [mailtrap](https://mailtrap.io/) Safe Email Testing for Staging & Development



## Routing

To route our pages and to have the url show which page we are currently on, we use react-router-dom