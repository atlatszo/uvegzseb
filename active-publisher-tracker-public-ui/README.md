# Active Publisher Tracker Public UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.7.

node version: v8.6.0
npm version: 5.3.0

## Install dependecies

Use [yarn](https://yarnpkg.com/en/) to install dependencies.

```
yarn install
```

## Development

Run `./docker-build-image.sh <tag-name>` to build an image if did't already.

Run `docker-compose up -d` and `npm run watch`. Navigate to http://localhost:8080/.

To be able to use re-captcha you need to:

* For local development: Create a json file called `config.json` in `src/assets/config` folder. Copy the `config.json.template` and add you key. 
To make it work in localhost, you need to whitelist 127.0.0.1 address, and access the page on http://127.0.0.1/8080/
 
* For build: Provide your key in the docker-compose file as an environment variable. 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `./docker-build-image.sh <tag-name>` to build the project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Also you can use wallaby to run unit tests in the editor. Configuration file is included in the project.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
