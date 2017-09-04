#!/usr/bin/env node

var path = require("path");
var os = require('os');
var url = require('url');
var request = require("request");
var exec = require('child_process').exec;
var debug = process.execArgv.find(function (e) { return e.startsWith('--debug'); }) !== undefined;

// Load settings 
var SettingsHelper = require("./lib/SettingsHelper.js");
var settingsHelper = new SettingsHelper();

var packagePath = settingsHelper.nodePackagePath;

process.env.NODE_PATH = packagePath;
process.env.HOME = os.userInfo().homedir;

require('app-module-path').addPath(packagePath);
require('module').globalPaths.push(packagePath);

var snapLoginHandler = new SnapLoginHandler(settingsHelper);
// If user hasn't logged in before we'll try to get the IMEI id

snapLoginHandler.start(settingsHelper.isFirstStart());

//if (settingsHelper.isFirstStart()) {    
//    snapLoginHandler.start();
//}
//else {
//    snapLoginHandler.start();
//}

function SnapLoginHandler(settingsHelper) {
    console.log("STARTSNAP: SnapLoginHandler started");
    var self = this;
    this.interval = null;
    var count = 0;
    this.start = function (isFirstStart) {
        this.interval = setInterval(function () {
            if (isFirstStart) {
                tryGetIMEI(function (imei) {
                    if (imei) {
                        clearInterval(self.interval);
                        self.interval = setInterval(function () {
                            tryLoginUsingICCID(imei, function (done) {
                                if (done) {
                                    clearInterval(self.interval);
                                    console.log("done");
                                }
                            })
                        }, 2000);
                    }
                })
            }
            else {
                pingBeforeStart(function (online) {
                    if (online) {
                        clearInterval(self.interval);
                        console.log("STARTSNAP: Online");
                        require("./start.js");
                    }
                })
            }
        }, 2000);
    }
    function pingBeforeStart (callback) {
        var hubUri = url.parse(settingsHelper.settings.hubUri);

        var uri = 'https://' + hubUri.host;
        console.log("STARTSNAP: pinging..." + uri);
        request.post({ url: uri, timeout: 5000 }, function (err, response, body) {
            if (err) {
                console.error("STARTSNAP: ERROR: error: " + err);
                callback();
                return;
            }
            else if (response.statusCode !== 200) {
                console.error("STARTSNAP: FAILED: response: " + response.statusCode);
                callback();
                return;
            }
            else {
                console.log("STARTSNAP: Got response from microServiceBus.com. All good...");
                require("./start.js");
                callback(true);
            }
        })
    }

    function tryGetIMEI(callback) {
        exec("sudo mmcli -m 0|grep -oE \"imei: '(.*)'\"|sed 's/imei: //g'|sed \"s/'//g\"", function (error, stdout, stderr) {
            console.log('STARTSNAP: imei: ' + stdout);
            if (error !== null) {
                console.log("STARTSNAP: Unable to get the IMEI id");
                console.log('STARTSNAP: ERROR: ' + error);

                callback();
            }
            else {
                imei = stdout;
                callback(imei);
            }
        });
    }
    function tryLoginUsingICCID(imei, callback) {
        var hubUri = url.parse(settingsHelper.settings.hubUri);

        var uri = 'https://' + hubUri.host + '/jasper/signInUsingICCID?iccid=' + imei;
        console.log("STARTSNAP: calling jasper service..." + uri);
        request.post({ url: uri, timeout: 5000 }, function (err, response, body) {
            if (err) {
                console.error("STARTSNAP: ERROR: error: " + err);
                callback();
                return;
            }
            else if (response.statusCode !== 200) {
                console.error("STARTSNAP: FAILED: response: " + response.statusCode);
                callback();
                return;
            }
            else {
                console.log("STARTSNAP: Got settings from microServiceBus.com. All good...");

                var settings = JSON.parse(body);
                settingsHelper.settings.id = settings.id;
                settingsHelper.settings.nodeName = settings.nodeName;
                settingsHelper.settings.organizationId = settings.organizationId;
                settingsHelper.settings.sas = settings.sas;
                settingsHelper.save();
                console.log("STARTSNAP: Saved settings");
                require("./start.js");
                callback(true);
            }
        })
    }
   
}