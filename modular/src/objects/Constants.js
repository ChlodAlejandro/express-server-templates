const path = require("path");

const Settings = require("./../../settings.json");

function getSettings(key, secondary = undefined) {
    var value = Settings;
    for (var path of key.split(".")) {
        if (value[path] === undefined)
            return secondary;
        value = value[path];
    }
    
    return value;
}

const SERVER_ROOT = path.resolve(getSettings("app.root", path.join(__dirname, "..", "..")));

const supposedAppRoot = getSettings("app.app_files", "./app");
if (supposedAppRoot.startsWith("./"))
    supposedAppRoot = supposedAppRoot.length > 2 ?
        path.join(APP_ROOT, supposedAppRoot.substring(2)) : APP_ROOT
const APP_ROOT = path.resolve(supposedAppRoot);

const constants = {
    App: {
        root: SERVER_ROOT,
        app_files: APP_ROOT
    },
    About: {
        name: getSettings("about.name", "modular-express-server"),
        displayName: getSettings("about.display_name", "Modular Express Server"),
        description: getSettings("about.description", "A simple Node.js Express server that runs on modules."),
        version: getSettings("about.version", "0.0.0"),
        contact: getSettings("about.contact", "webmaster@example.com")
    },
    Server: {
        mode: getSettings("server.mode", "HTTP_ONLY"),
        port: getSettings("server.port", 80),
        sslPort: getSettings("server.sslPort", 443),
    },
    SSL: Settings.ssl ? {
        keyPath: Settings.ssl.key ? Settings.ssl.key : path.resolve(`${APP_ROOT}/ssl/privkey.pem`),
        certificatePath: Settings.ssl.certificate ? Settings.ssl.certificate : path.resolve(`${APP_ROOT}/ssl/cert.pem`),
        chainPath: Settings.ssl.chain ? Settings.ssl.chain : path.resolve(`${APP_ROOT}/ssl/chain.pem`)
    } : undefined
};

module.exports = constants;