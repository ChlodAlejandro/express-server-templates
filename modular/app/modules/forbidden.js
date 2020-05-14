"use strict";

const {Module} = require("../../src/ModularExpressServer.js");

module.exports = new Module(
    {
        name: "Forbidden!",
        sector: "Tests",
        description:
            "Shows a 403 Forbidden error to the user."
    },
    "^/super_secret_page$",
    {
        processWebRequest: async ({res, server}) => {
            // Of course, not all variables are required. However, if someone were to
            // provide a custom ErrorManager, the provided arguments will then be lacking.
            server.getErrorManager().sendError({
                errorCode: 403,
                res: res
            });
        }
    }
);
