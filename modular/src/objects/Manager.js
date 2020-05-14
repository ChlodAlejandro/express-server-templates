module.exports = class Manager {

    initialize() {
        if (this.name === undefined && this.displayName === undefined && this.desc === undefined) {
            throw new Error("Manager extended incorrectly.");
        }

        console.log("Loading manager: \"" + this.name + "\"");
        if (typeof(this.load) === "function") this.load();
    }

};