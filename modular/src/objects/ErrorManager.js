const HttpStatus = require("http-status-codes");

const Manager = require("./../objects/Manager");
const Constants = require("./../objects/Constants");

module.exports = class ErrorManager extends Manager {
  
    constructor() {
        super();
        
        this.name = "errorManager";
        this.displayName = "Error Manager";
        this.desc = "The error manager automatically handles server errors and mishaps, in order to provide a response as much as possible. The Error Manager can be instantiated as is, or can be inherited from to create a custom manager.";
    }

    enable() {
        this.enabled = true;
        console.log("Enabled the Error Manager.");
    }
    
    disable() {
        console.warn("Disabling the Error Manager.")
        this.enabled = false;
    }

    handleException({exception, log, res}) {
        log.write("Exception occurred: " + exception.message, exception);
        console.error(exception);

        this.sendError({
            errorCode: 500,
            res: res
        });
    }

    sendError({errorCode, res}) {
        res.set("Content-Type", "text/html");

        var errorDetails = `${errorCode} ${HttpStatus.getStatusText(errorCode)}`

        var html = "<html>";
        html += "<head>";
        html += `<title>${errorDetails}</title>`;
        html += "</head>";
        html += "<body>";
        html += `<h1>${errorDetails}</h1>`;
        html += `<p>${Constants.About.displayName} v${Constants.About.version}<br/>`;
        html += `For more info, contact the webmaster at <a href="mailto:${Constants.About.contact}">`
        html += `${Constants.About.contact}</a></p>`;
        html += "</body>";
        html += "</html>";

        res.send(html);
    }
  
};