"use strict";

const {Module} = require("../../src/ModularExpressServer.js");

module.exports = new Module(
    {
        name: "Hello World",
        sector: "Tests",
        description:
            "Shows a simple Hello World."
    },
    "^/$",
    {
        processWebRequest: async ({res}) => {
            res.set("Content-Type", "text/plain");
          
            res.send(
                "Hello World! Looks like you got that template running!\r\n"
                + "You should go ahead and make your own modules under `/app/modules`.");
        }
    }
);
