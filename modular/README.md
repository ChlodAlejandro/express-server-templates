# Express Server Templates / Modular
The modular web server is a more object-oriented web server. Each "endpoint" resides in "modules".

To use the bare server, run `npm start` or `node src/server.js` in this directory.

## Definition of Terms
* **Endpoint** - a certain location on the website. In Express, this is referred to as the path. An example of an endpoint would be `/favicon.ico` for the website favicon, or `/index.html` for an index webpage.
* **Module** - an object which defines what a specific endpoint should return to the user. Each module is responsible for sending the appropriate response. Each module requires a name, their category, a short description, a regular expression (RegExp) which matches on any endpoint handled by the module, and a function that handles a user's request.
* **Manager** - a class which can be accessed by all modules, and is initialized on server startup. Managers are used to transfer information between modules, handle server events, and for maintenance.
* **ErrorManager** - a specialized version of `Manager`, which handles internal errors. It can also be used to send regular HTTP error codes to the user.
* **Index class** - refers to the `ModularExpressServer.js` file inside of `src`. This class exposes the classes you need for your server.

## Usage

Place all your module files in `app/modules`. Each file must be exporting an instatiated `Module` object. Place all your manager files in `app/managers`, and instantiate them in `app/Managers.js`.

There are 3 pre-installed modules.
* `hello_world.js` (found on `/`) - shows a simple Hello World message.
* `forbidden.js` (found on `/super_secret_page`) - sends a 403 message built with the server's ErrorManager. (if there are multiple ErrorManagers, it will use the first in `Managers.js`.)
* `endpoint_tester.js` (found on `/test`) - responds with the details of the user's request.

In `Managers.js`, the default `ErrorManager` is loaded. This means errors are automatically handled out of the box.

Don't forget to download dependencies first using `npm i`.

Run the server with `npm start` or `node src/server.js` in this directory.

## `settings.json`
The modular server has more configuration settings compared to the bare server. This does mean that the configuration may also get a bit more complicated.

Some keys depend on other keys. Make sure that those are satisfied as well.

The possible configurations are shown below.
```js
{
    // This category contains keys that define application constants (constants that)
    // are specific to this installation of the template.
    "app": {

        // The location of the web server. This should be the directory that contains
        // `src`, not `src` itself.
        "root": "/var/web/modular",

        // The location of the app files. This is the directory that contains the `managers`
        // and `modules` folders. If this path starts with a `./`, the location of the folder
        // will be considered relative to the root of the app (the root as stated above.)
        "app_files": "./app" // This is equivalent to `/var/web/modular/app`

    },

    // This category contains keys that define the web server's details. This includes the
    // name of the web server, its primary contact, etc.
    //
    // This is used by ErrorManager to display additional info.
    "about": {

        // The name of the server. Treat this like the name of the project in `package.json`.
        "name": "modular-express-server",

        // The display name of the server. This will be shown to users.
        "displayName": "Modular Express Server",

        // The description of the server. Treat this like the description of the project
        // in `package.json`.
        "description": "A simple, object-oriented Node.js Express server that runs on Modules.",

        // The version of the server.
        "version": "1.0.0",

        // The primary contact of the server. This should be an email. If not, you should modify
        // ErrorManager.
        "contact": "webmaster@example.com"

    },

    // This category contains keys that define this web server's operation. This includes the
    // ports and protocols it will use.
    "server": {

        // This defines the protocol mode of the web server.
        //
        // `HTTP_ONLY` will make the server run with only HTTP.
        // `HTTPS_ONLY` will make the server run with only HTTPS.
        // `HTTP_AND_HTTPS` will make the server run with both HTTP and HTTPS.
        //
        // If HTTP is used, `port` must be defined.
        // If HTTPS is used, `sslPort`, and the `ssl` category must be defined.
        //
        // If you're looking for the option without HTTP nor HTTPS, then just don't run
        // the server at all.
        "mode": "HTTP_ONLY",

        // The HTTP port of the server.
        "port": 80,

        // The HTTPS port of the server.
        "sslPort": 443

    },

    // This category defines the location of required SSL files, in order to properly run the
    // server under HTTPS. If this is set to false, SSL will not run. If this is set to true,
    // SSL will run, and will use the default paths. You can also choose to customize the path
    // of each file as seen below.
    //
    // If a path is undefined, it will use the following default paths:
    // 
    //     For "key", "<YOUR APP ROOT>/ssl/privkey.pem".
    //     For "certificate", "<YOUR APP ROOT>/ssl/cert.pem".
    //     For "chain", "<YOUR APP ROOT>/ssl/chain.pem".
    //
    // These are relative to `server.js`, inside of `src`.

    "ssl": {

        // This is equivalent to `/var/web/modular/app/ssl/privkey.pem`
        "key": "../app/ssl/privkey.pem",

        // This is equivalent to `/var/web/modular/app/ssl/cert.pem`
        "certificate": "../app/ssl/cert.pem",
        
        // This is equivalent to `../app/ssl/chain.pem`
        "chain": "/var/web/modular/app/ssl/chain.pem"

    }
    
}
```

## Security
If you are able to find security issues, please disclose them in an email to [chlod@chlod.net](mailto:chlod@chlod.net).