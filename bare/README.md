# Express Server Templates / Bare
The bare server is a simple web server with extremely basic error handling.

To use the bare server, run `npm start` or `node src/server.js` in this directory.

## Usage

Run the server with `npm start` or `node src/server.js` in this directory.

To modify the output, change the function inside of `request.js`. Please make sure that this file exports an asynchronus function that takes in an Express `req` (request) and `res` (response), or else the server will automatically close the connection without sending data.

## `settings.json`
You may slightly configure your installation of the bare server. If you'd like to run on all defaults, you can choose to keep `settings.json` as is, or delete the file entirely. 

The possible configurations are shown below.
```js
{
    // The location of the web server. This should be the directory that contains
    // `src`, not `src` itself.
    "app_root": "/var/web/bare",


    // The port to use for the web server. On Linux, root is required for any port
    // from 1024 and below.
    "port": 80,

    // The SSL settings. If you choose to run without SSL, set this to false.
    // Otherwise, you need to fill up all three of the values inside this object.
    "ssl": {
        "key": "ssl/privkey.pem", // The SSL private key.
        "certificate": "ssl/cert.pem", // The SSL certificate.
        "chain": "ssl/chain.pem" // The SSL certificate chain.
    }
}
```

## Security
If you are able to find security issues, please disclose them in an email to [chlod@chlod.net](mailto:chlod@chlod.net).