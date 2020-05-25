# PMS
Personnel Management System Cloud Application for the Lecture Cloud Application Development.

## Cloning Project
* `git clone git@github.com:JaromirCharles/PMS.git`
* execute `npm install` within the frontend folder then `npm start`

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

To start the application, run `npm start` which launches the application on `http://localhost:8080`.

Development is done using `Visual Studio Code` and `Firefox`.

* Visual Studio Code
  * Provides useful React extensions
    * [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) Code formatter using prettier
    * [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets) Code snippets for JavaScript in ES6 syntax
* Firefox
  * The [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) have been downloaded for a better development experience.



## Application Setup 

* `React Router Dom` is used to route through the different pages. Install with `npm install --save react-router-dom`.
* `Material-UI` is used to design the system. Install Material-UI's source files with `npm install --save @material-ui/core`.
  * `Material-UI` offers over 1000+ icons. Install with `npm install --save @material-ui/icons`

* [bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/). 

* `axios` promised based HTTP client to interact with the REST API. Install with `npm install --save axios`