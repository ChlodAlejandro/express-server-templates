"use strict";

// Import required libraries
const path = require("path");
const express = require("express");
const axios = require("axios");
const fs = require("fs-jetpack");

const Logger = require("./logger.js");
var Settings;

try {
    Settings = require("./../settings.json");
} catch (e) {
    Settings = {};
}

// You can manually set this, or have it like this instead.
// This directory should be the directory where "src" is located, not inside of "src" itself.
const APP_ROOT = Settings.app_root ? Settings.app_root : path.resolve(path.join(__dirname, ".."));

// Set the application constants
const Constants = {
    App: {
        port: Settings.port ? Settings.port : 80,
        root: APP_ROOT
    },
    SSL: Settings.ssl ? {
        keyPath: Settings.ssl.key ? Settings.ssl.key : `${APP_ROOT}/ssl/privkey.pem`,
        certificatePath: Settings.ssl.certificate ? Settings.ssl.certificate : `${APP_ROOT}/ssl/cert.pem`,
        chainPath: Settings.ssl.chain ? Settings.ssl.chain : `${APP_ROOT}/ssl/chain.pem`
    } : undefined
};

// Add a timestamp to all logs
require("log-timestamp");
// Create the logger
var log = new Logger(
    path.join(APP_ROOT, Settings.log_path ? Settings.log_path : path.join("logs", "server.log")));

// The actual web server.
class BareExpressServer {

    async start() {
        console.log("[!] App started.");
        // Create the router and Express app
        this.app = express();
        this.router = express.Router({ caseSensitive: true });
        this.app.use(this.router);
        
        // Use the User Agent parser.
        this.router.use(require("express-useragent").express());
        
        this.router.all("*", async (req, res) => {
            var ip = (req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0] : req.connection.remoteAddress);
			log.write("Receiving connection from " + ip, {
				"Path": req.path,
				"User Agent": req.useragent.source
			});
			
            try {
                await(require(path.join(APP_ROOT, "request.js")))(req, res);
            } catch (e) {
                res.status(500);
                log.write("An error occurred while processing a request.", e);
                res.set("Content-Type", "text/plain");
                res.send("An error occurred. Maybe try again later?");
            }

            if (!res.headersSent) {
                res.status(204);
                res.send();
            }
        });

        if (Constants.SSL) {
            log.write("Running with SSL...");
            this.listener = require("https").createServer({
                ca: fs.read(Constants.SSL.chainPath),
                key: fs.read(Constants.SSL.keyPath),
                cert: fs.read(Constants.SSL.certificatePath)
            }, this.app);
        } else
            this.listener = require("http").createServer(this.app);

        this.listener.listen(Constants.App.port, () => {
            console.log("App is listening on port " + this.listener.address().port);
        });
    }

}

(new BareExpressServer()).start();