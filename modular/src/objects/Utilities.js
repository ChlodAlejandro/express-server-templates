"use strict";

module.exports = class Utilities {

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

};