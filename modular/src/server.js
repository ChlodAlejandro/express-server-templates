"use strict";

const fs = require("fs-jetpack");
const path = require("path");
const express = require("express");

require("log-timestamp");

const Module = require("./objects/Module.js");
const ModuleUtilities = require("./objects/ModuleUtilities.js");
const Logger = require("./objects/Logger.js");
const Constants  = require("./objects/Constants.js");
const ErrorManager = require("./objects/ErrorManager");

const moduleIgnoreRegex = /(?:(?:^\.)|ignore|archive)/gi;
const pathLogIgnoreRegex = /\/?(favicon\.ico|css|scripts|images|.+\.css$|.+\.js$)/gi;

var log = new Logger(path.join(Constants.App.root, "logs", "server.log"));

require("log-timestamp");
class ModularExpressServer {
    
    checkProtocols() {
        var protocols = {
            http: true,
            https: false
        }
        console.log(Constants.Server.mode);
        switch (Constants.Server.mode) {
            case "HTTPS_ONLY": {
                protocols = {
                    http: false,
                    https: true
                }
                break;
            }
            case "ALL":
            case "HTTPS_AND_HTTP":
            case "HTTP_AND_HTTPS": {
                protocols = {
                    http: true,
                    https: true
                }
                break;
            }
        }
        return protocols;
    }

    getWebRequestManagers() {
        var output = {};
        for (var manager in this.managers) {
            output[this.managers[manager].name] = this.managers[manager];
        }
        return output;
    }


    getErrorManager() {
        for (var manager of this.managers) {
            if (manager instanceof ErrorManager) {
                return manager;
            }
        }
        return undefined;
    }
    
    searchForPathInModules(path) {
        for (var m of this.modules) {
            if (m.listenOn.test(path))
                return m;
        }
    }

    gatherModules(directory) {
        var foundModules = require("fs-jetpack").inspectTree(directory);

        var childModules = [];
        
        for (var childModule of foundModules.children) {
            if (childModule !== undefined) {
                if (childModule.type === "dir" && !moduleIgnoreRegex.test(childModule.name))
                    childModules = [...childModules, ...this.gatherModules(path.join(directory, childModule.name))];
                
                if (childModule.type === "file") {
                    var module = require(path.resolve(path.join(directory, childModule.name)));
                    if (module.constructor.prototype instanceof Module || module instanceof Module)
                        childModules.push(module);
                    else
                        module = undefined;
                }
            }
        }

        return childModules;
    }

    getExportPackage() {
        return {
            managers: this.getWebRequestManagers(),
            modules: this.modules
        };
    }

    async start() {
        log.write("[!] App started at " + ModuleUtilities.getTimestamp());
    
        // create the router and app
        this.app = express();
        this.router = express.Router({ caseSensitive: true });
        this.app.use(this.router);
        
        this.router.use(require("express-useragent").express());
        this.router.use(require("cookie-parser")());
        this.router.use(express.json());
        this.router.use(express.urlencoded({ extended: true }));
    
        // gather the modules
        this.modules = this.gatherModules(path.resolve(path.join(Constants.App.app_files, "modules")));
        
        // start the managers
        try {
            this.managers = require(path.resolve(path.join(Constants.App.app_files, "Managers.js")));

            for (let manager of this.managers)
                manager.initialize();
        } catch (exception) {
            this.managers = [];
        }

        this.errorManager = this.getErrorManager();
        
        this.router.all("*", async (req, res) => {
            var ip = (req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0] : req.connection.remoteAddress);
            var searchTries = 0;
            var foundModule = false;
        
            var out_log = !pathLogIgnoreRegex.test(req.path);
    
            log.write(`[${ip}] Locating module for ${req.path}...`);

            var module;
            do {
                module = this.searchForPathInModules(req.path);
        
                if (module !== undefined)
                    break;
                
                searchTries++;
            } while (searchTries < 2 && !foundModule);

            if (module === undefined) {
                log.write(`[${ip}] Module not found for path: ${req.path}`);
                log.write(`Receiving connection from ${ip}...`, {
                    "Path": req.path,
                    "User Agent": req.useragent.source,
                    "Module Found": false
                });

                if (this.errorManager !== undefined)
                    this.errorManager.sendError({
                        errorCode: 404,
                        log: log,
                        req: req,
                        res: res, 
                        managers: this.getWebRequestManagers(),
                        server: this
                    });
            } else {
                log.write(`[${ip}] Module found for ${req.path}.`);
                if (out_log) {
                    log.write(`Receiving connection from ${ip}...`, {
                        "Path": req.path,
                        "User Agent": req.useragent.source,
                        "Module Found": true
                    });
                }

                if (module.active) {
                    try {
                        await module.processWebRequest({
                            log: log, 
                            req: req,
                            res: res,
                            managers: this.getWebRequestManagers,
                            server: this
                        });
                    } catch (e) {
                        if (this.errorManager !== undefined)
                            this.errorManager.handleException({
                                exception: e,
                                log: log,
                                req: req,
                                res: res, 
                                managers: this.getWebRequestManagers(),
                                server: this
                            });
                    }
                } else {
                    if (this.errorManager !== undefined)
                        this.errorManager.sendError({
                            errorCode: 503,
                            log: log,
                            req: req,
                            res: res, 
                            managers: this.getWebRequestManagers(),
                            server: this
                        });
                }
            }
        });

        await this.enableManagers();
        await this.enableModules();
    
        var allowedProtocols = this.checkProtocols();
        if (Constants.SSL !== undefined && allowedProtocols.https) {
            log.write(`Running HTTPS listener on port ${Constants.Server.sslPort}...`);
            this.httpsListener = require("https").createServer({
                ca: fs.read(Constants.SSL.chainPath),
                key: fs.read(Constants.SSL.keyPath),
                cert: fs.read(Constants.SSL.certificatePath)
            }, this.app);
            this.httpsListener.listen(Constants.Server.sslPort, async () => {
                log.write(`HTTPS is listening on port ${this.httpsListener.address().port}.`);
            });
        }
        if (allowedProtocols.http) {
            log.write(`Running HTTP listener on port ${Constants.Server.port}...`);
            this.httpListener = require("http").createServer(this.app);
            this.httpListener.listen(Constants.Server.port, async () => {
                log.write(`HTTP is listening on port ${this.httpListener.address().port}.`);
            });
        }
    }

    async enableManagers() {
        for (var managerIndex in this.managers)
            await(this.managers[managerIndex].enable());
    }

    async disableManagers() {
        for (var managerIndex in this.managers)
            await(this.managers[managerIndex].disable());
    }

    async enableModules() {
        for (var moduleIndex in this.modules)
            await(this.modules[moduleIndex].enable(false));
    }

    async disableModules() {
        for (var moduleIndex in this.modules)
            await(this.modules[moduleIndex].disable());
    }

}

(new ModularExpressServer()).start();