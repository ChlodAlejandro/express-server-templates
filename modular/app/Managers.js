"use strict";

//
// This is the Managers.js file. Here, you are supposed to place
// instantiated Manager objects in an array. All of these Managers
// will be initialized by the server during runtime. Do NOT load
// or initialize the Managers yourself.
//
// Manager objects follow the given lifecycle:
// 
//     in Managers.js
//     constructor()
//
//     in server.js
//     *initialize() ---> load() ---> enable()
//
//     anytime
//     disable() ---> disposal through garbage collection
//
// Functions marked with * are automatic and must not be replaced
// through function shadowing.
//
// The following definition includes a built-in manager, ErrorManager,
// which handles internal server errors automatically.
//
// You may choose to extend ErrorManager, or to use the default version.
const ErrorManager = require("./../src/objects/ErrorManager");

module.exports = [
    new ErrorManager()
];