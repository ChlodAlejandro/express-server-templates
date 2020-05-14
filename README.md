# Express Server Templates
This repository contains Node.js Express server templates, so that you can deploy a web server with basic built-in logging and configuration.

This is meant for rapid-deployment installations. If you wish to have a robust server, I suggest you code your own server instead.

## Usage
To use an installation, clone this repository (or download a template from the releases) and select a template. Every template contains a `package.json` which has the `start` command pre-filled. This means you can immediately run `npm start` out of the box.

## Templates
The templates in this repository are as follows:

* **Bare** - A bare Express server, with very basic configuration and error handling. All requests run through a single script, `request.js`.
* **Modular** - An object-oriented Express server, which automatically loads every file in the `modules` directory. Each module is a `Module` object. An additional object, `Manager`, exists for managing server processes between modules, or for basic server maintenance. Unlike `Module`s, which are instantiated, `Manager`s must be inherited instead.

For development servers, you may wish to run the servers with [`forever`](https://www.npmjs.com/package/forever) instead, so that the server is reloaded as soon as you change a file.

## Security
If you are able to find security issues, please disclose them in an email to [chlod@chlod.net](mailto:chlod@chlod.net).