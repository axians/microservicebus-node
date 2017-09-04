/*
The MIT License (MIT)

Copyright (c) 2014 microServiceBus.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var fs = require('fs');
var util = require('./lib//Utils.js');
var pjson = require('./package.json');
var site = "wss://microservicebus.com";
require('colors');

var args = process.argv.slice(2);

var SettingsHelper = require("./lib/SettingsHelper.js");
var settingsHelper = new SettingsHelper();

if (args.length > 0) {
    switch (args[0]) {
 
        case '-all':
            deleteFolderRecursive(settingsHelper.homeDirectory + '/microServiceBus.BizTalk');
            deleteFolderRecursive(settingsHelper.homeDirectory + '/data');
            deleteFolderRecursive(settingsHelper.homeDirectory + '/output');
            deleteFolderRecursive(settingsHelper.homeDirectory + '/persist');
            deleteFolderRecursive(settingsHelper.homeDirectory + '/cert');
            console.log("Deleted".green);
            break;
        case '-debug':
            site = "wss://localhost:44302";
            console.log("Setting host to localhost".green);
            break;
        case '-stage':
            site = "wss://microservicebus-northeurope-stage.azurewebsites.net";
            console.log("Setting host to stage".green);
            break;

        case '-?':
            console.log("-all, -cert or -debug".yellow);
            return;
        default:
            console.log("Unsupported argument.".red);
            console.log("-all, -cert or -debug".yellow);
            return;
    }
}

// Update settings

settingsHelper.settings = {
    "hubUri": site,
    "trackMemoryUsage": 0,
    "enableKeyPress": false,
    "useEncryption": false,
    "log": ""
}
settingsHelper.save();
console.log("Settings updated".green);
console.log();

console.log("UPDATE VERSION!".red + " Current package version: " + pjson.version.green);


function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
