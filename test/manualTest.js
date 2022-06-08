var util = require("../lib/Utils.js");
util.addNpmPackage("microservicebus-core@latest", true, function (err) {
    if (err) {
        console.log("Unable to install core update".bgRed.white);
        console.log("Error: " + err);
        throw err;
    }
    else {
        console.log("Core installed successfully".bgGreen.white);
        done();
    }
});