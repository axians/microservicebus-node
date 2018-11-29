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

/* jshint node: true */
/* jshint esversion: 6 */
/* jshint strict:false */
'use strict';
require('colors');
var util = require('./lib/Utils.js');
var pjson = require('./package.json');
var checkVersion = require('package-json');
var npm = require('npm');
var fs = require('fs');
var os = require('os');
var async = require('async');
let network = require('network');

process.on('unhandledRejection', err => {
    console.log("SERIOUS ERROR: Caught unhandledRejection. ", err);
});

var _ipAddress;
var maxWidth = 75;
var debugPort = 9230;
var debug = process.execArgv.find(function (e) { return e.startsWith('--debug'); }) !== undefined;
var args = process.argv.slice(1);

if (debug)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
else {
    network.get_active_interface(function (err, nw) {
        _ipAddress = nw.ip_address;
    });
}
// Load settings 
var SettingsHelper = require("./lib/SettingsHelper.js");
var settingsHelper = new SettingsHelper();

if (debug) {
    console.log("Start with debug");
    start(true);
}
else {
    startWithoutDebug();
}

function startWithoutDebug() {
    var cluster = require('cluster');

    var fixedExecArgv = [];
    if (cluster.isMaster) {
        var worker = cluster.fork(process.env);

        cluster.on('exit', function (worker, code, signal) {
            console.log('Exit called. code:' + signal);
            worker = cluster.fork(process.env);

            console.log('CODE:' + code.bgGreen.white.bold);
            if (code === 99) { // Controlled exit
                console.log("Controlled exit");
                process.exit(0);
            }
            else if (cluster.settings.execArgv.find(function (e) { return e.startsWith('--inspect'); }) !== undefined) {

                console.log();
                console.log(util.padRight("", maxWidth, ' ').bgGreen.white.bold);
                console.log(util.padRight(" IN DEBUG", maxWidth, ' ').bgGreen.white.bold);
                console.log(util.padRight("", maxWidth, ' ').bgGreen.white.bold);
                console.log();

            }
            else {
                console.log();
                console.log(util.padRight(" NORMAL START", maxWidth, ' ').bgGreen.white.bold);
                console.log();
            }
        });

        cluster.on('message', function (worker, message, handle) {
            try {

                //console.log(util.padRight(" MESSAGE CALLED:" + JSON.stringify(message) + ".", maxWidth, ' ').bgGreen.white.bold);

                if (message.cmd === 'START-DEBUG') {
                    console.log(util.padRight(" DEBUG MODE", maxWidth, ' ').bgGreen.white.bold);
                    fixedExecArgv.push('--inspect=' + _ipAddress + ':' + debugPort);

                    cluster.setupMaster({
                        execArgv: fixedExecArgv
                    });

                }
                else if (message.cmd === 'SHUTDOWN') {

                    process.exit(99);

                }
                else {

                    cluster.setupMaster({
                        execArgv: []
                    });
                    for (var id in cluster.workers) {
                        console.log(util.padRight(" Killing", maxWidth, ' ').bgGreen.white.bold);
                        cluster.workers[id].process.disconnect();
                        cluster.workers[id].process.kill('SIGTERM');
                    }
                }
            }
            catch (gerr) {
                console.log("ERROR (on message): ".bgRed.white + gerr);
            }
        });
    }

    if (cluster.isWorker) {
        console.log("start worker");
        start();
    }
    process.on('uncaughtException', function (err) {
        if (err.errno === 'ECONNREFUSED') {

            for (var id in cluster.workers) {
                console.log(util.padRight(" Killing", maxWidth, ' ').bgRed.white.bold);
                cluster.workers[id].process.disconnect();
                cluster.workers[id].process.kill('SIGTERM');
            }
        }
    });
}

function start(testFlag) {
    var started = false;

    console.log();
    console.log(util.padRight("", maxWidth, ' ').bgBlue.white.bold);
    console.log(util.padRight(" microServicebus.com", maxWidth, ' ').bgBlue.white.bold);
    console.log(util.padRight(" Node.js version    : " + process.version, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" NPM package version: " + pjson.version, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" Architecture       : " + process.arch, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" Agent host         : " + settingsHelper.agentHost, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" Home directory     : " + settingsHelper.homeDirectory, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" NPM directory      : " + settingsHelper.nodePackagePath, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" For more information visit: http://microservicebus.com", maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" GIT repository: https://github.com/axians/microservicebus-node", maxWidth, ' ').bgBlue.white);
    console.log(util.padRight("", maxWidth, ' ').bgBlue.white.bold);
    console.log();

    checkVersionsAndStart(function (err) {
        if (err) {
            var interval = setInterval(function (err) {
                checkVersionsAndStart(function (err) {
                    if (!err) {
                        clearInterval(interval);
                        console.log('leaving interval');
                    }
                    else {
                        // Offline mode...
                        if ((err.code === "ECONNREFUSED" ||
                            err.code === "EACCES" ||
                            err.code === "ENOTFOUND") &&
                            settingsHelper.settings.policies &&
                            settingsHelper.settings.policies.disconnectPolicy.offlineMode) {
                            clearInterval(interval);
                            console.log('Starting in offline mode'.red);
                            var MicroServiceBusHost = require("microservicebus-core").Host;
                            var microServiceBusHost = new MicroServiceBusHost(settingsHelper);

                            microServiceBusHost.OnStarted(function (loadedCount, exceptionCount) {

                            });
                            microServiceBusHost.OnStopped(function () {

                            });
                            microServiceBusHost.OnUpdatedItineraryComplete(function () {

                            });
                            microServiceBusHost.Start(testFlag);
                        }
                        else {
                            console.log('retrying...');
                        }
                    }
                });
            }, 10000);
        }
    });


    function checkVersionsAndStart(done) {
        async.waterfall([
            function (callback) { // Check version of microservicebus-node
                console.log("mSB.node: " + pjson.name);

                checkVersion(pjson.name)
                    .then(function (rawData) {
                        var latest = rawData['dist-tags'].latest;
                        if (util.compareVersion(pjson.version, latest) < 0) {
                            console.log();
                            console.log(util.padRight("", maxWidth, ' ').bgRed.white.bold);
                            console.log(util.padRight("There is a new version of microservicebus-node: " + latest, maxWidth, ' ').bgRed.white.bold);
                            console.log(util.padRight("type: 'npm update microservicebus-node' ", maxWidth, ' ').bgRed.gray.bold);
                            console.log(util.padRight(" from the root folder to get the latest version", maxWidth, ' ').bgRed.gray.bold);
                            console.log(util.padRight("", maxWidth, ' ').bgRed.white.bold);
                            console.log();
                            callback();
                        }
                        else {
                            callback();
                        }
                    })
                    .catch(function (err) {
                        callback(err);

                    });
            },
            function (callback) { // Check version of microservicebus-core
                let microservicebusCore = "microservicebus-core";
                if (pjson.config && pjson.config.microservicebusCore) {
                    microservicebusCore = pjson.config.microservicebusCore;
                    console.log("mSB.core: " + microservicebusCore);
                }

                checkVersion(microservicebusCore)
                    .then(function (rawData) {

                        let path = require("path");
                        let packagePath;
                        let packageFile;

                        // Check if node is started as Snap
                        if (process.argv[1].endsWith("startsnap")) {
                            console.log("Loading microservicebus-core/package.json for snap");
                            console.log("nodePackagePath: " + settingsHelper.nodePackagePath)
                            packageFile = path.resolve(settingsHelper.nodePackagePath, 'microservicebus-core/package.json');
                        }
                        else {
                            try {
                                packagePath = require.resolve(rawData.name);
                                packagePath = path.dirname(packagePath);
                                packageFile = path.resolve(packagePath, 'package.json');
                            }
                            catch (e) { }
                        }

                        var corePjson;

                        if (fs.existsSync(packageFile)) {
                            corePjson = require(packageFile);
                        }

                        var isBeta = args.find(function (a) {
                            return a === "--beta";
                        });
                        var latest = rawData['dist-tags'].latest;

                        if (isBeta) {
                            latest = rawData['dist-tags'].beta;
                            console.log('RUNNING IN BETA MODE'.yellow);

                        }
                        else if(settingsHelper.settings.coreVersion && (settingsHelper.settings.coreVersion !== "latest" || settingsHelper.settings.coreVersion !== "beta")){
                            latest = settingsHelper.settings.coreVersion;
                        }
                        if (corePjson === undefined || util.compareVersion(corePjson.version, latest) !== 0) {
                            var version = corePjson === undefined ? "NONE" : corePjson.version;
                            console.log();
                            console.log(util.padRight("", maxWidth, ' ').bgGreen.white.bold);
                            console.log(util.padRight(" New version of Core available. Performing update, please wait...", maxWidth, ' ').bgGreen.white.bold);
                            console.log(util.padRight(" Current version: " + version + ". New version: " + latest, maxWidth, ' ').bgGreen.white.bold);
                            console.log(util.padRight("", maxWidth, ' ').bgGreen.white.bold);
                            console.log();

                            let corePkg = isBeta ? rawData.name + "@beta" : rawData.name + "@"+latest;
                            let successfulUpdate = true;
                            let updateComplete = false;
                            setTimeout(() => {
                                if (updateComplete) return;

                                successfulUpdate = false;
                                console.log("Unable to install latest version of miicroservicebus-core. Restarting process.".red)
                                process.exit();
                            }, 10 * 60 * 1000); // Installation should complete in 5 min 

                            util.addNpmPackage(corePkg, true, function (err) {
                                updateComplete = true;
                                if (!successfulUpdate) {
                                    //  The prossess should have started with old config
                                    return;
                                }
                                if (err) {
                                    console.log("Unable to install core update".bgRed.white);
                                    console.log("Error: " + err);
                                    callback(err);
                                }
                                else {
                                    console.log("Core installed successfully".bgGreen.white);
                                    callback();
                                }
                            });
                        }
                        else {
                            callback();
                        }
                    })
                    .catch(function (err) {
                        console.log('ERROR: ' + err);
                        callback(err);
                    });
            }
        ],
            function (err) { // Starting microServiceBusHost
                if (err) {
                    console.log('ERROR: ' + err);
                    done(err);
                }
                else {
                    let microservicebusCore = "microservicebus-core";
                    if (pjson.config && pjson.config.microservicebusCore) {
                        microservicebusCore = pjson.config.microservicebusCore;
                        console.log("mSB.core: " + microservicebusCore);
                    }
                    console.log("Starting ".grey + microservicebusCore.grey);
                    var MicroServiceBusHost = require(microservicebusCore).Host;
                    var microServiceBusHost = new MicroServiceBusHost(settingsHelper);

                    microServiceBusHost.OnStarted(function (loadedCount, exceptionCount) {

                    });
                    microServiceBusHost.OnStopped(function () {

                    });
                    microServiceBusHost.OnUpdatedItineraryComplete(function () {

                    });
                    microServiceBusHost.Start(testFlag);
                    done();
                }

            });
    }

}


