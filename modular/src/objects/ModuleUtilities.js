"use strict";

module.exports = class ModuleUtilities {

    static getTimestamp() {
        var date = new Date();
      
        var day = date.getDate();
        var month = date.getMonth() + 1; 
        var year = date.getFullYear(); 
      
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
    
        return month + "/" + day + "/" + year + " " + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2) + " UTC";
    }

    static getBasicError(errorCode, customDesc) {
        errorCode = errorCode + "";
        switch (errorCode) {
            case "400": {
                return {
                    err_code: 400,
                    err_name: "Bad Request",
                    err_desc:
                        customDesc || "The server might have not received the correct arguments for this endpoint."
                };
            }
            case "401": {
                return {
                    err_code: 401,
                    err_name: "Unauthorized",
                    err_desc:
                        customDesc || "You are not given the proper authority to access this endpoint."
                };
            }
            case "403": {
                return {
                    err_code: 403,
                    err_name: "Forbidden",
                    err_desc:
                        customDesc || "You are not allowed to access this endpoint."
                };
            }
            case "404": {
                return {
                    err_code: 404,
                    err_name: "Not Found",
                    err_desc:
                        customDesc || "The server did not find a module that matches that endpoint."
                };
            }
            case "405": {
                return {
                    err_code: 405,
                    err_name: "Method Not Allowed",
                    err_desc:
                        customDesc || "The request method used is not allowed for this endpoint."
                };
            }
            case "423": {
                return {
                    err_code: 423,
                    err_name: "Locked",
                    err_desc:
                        customDesc || "The resource being accessed is locked."
                };
            }
            case "429": {
                return {
                    err_code: 429,
                    err_name: "Too Many Requests",
                    err_desc:
                        customDesc || "Slow down."
                };
            }
            case "500": {
                return {
                    err_code: 500,
                    err_name: "Internal Server Error",
                    err_desc:
                        customDesc || "The server failed to process the output of this endpoint correctly."
                };
            }
            case "503": {
                return {
                    err_code: 503,
                    err_name: "Service Unavailable",
                    err_desc:
                        customDesc || "The service being accessed is unavailable at the moment."
                };
            }
            default:
                return {
                    err_code: +(/^([0-9]+)/g.exec(errorCode)[1]),
                    err_name: "Unknown Error",
                    err_desc:
                        customDesc || "This error is not recognized by the server."
                };
        }
    }

};