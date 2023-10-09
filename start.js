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
var fs = require('fs');
var os = require('os');
var async = require('async');
let network = require('msb-network');
let minimist = require('minimist');

console.log(`PROCESS: ${require('process').pid}`)

process.on('unhandledRejection', err => {
    console.log("SERIOUS ERROR: Caught unhandledRejection. ", err);
});

var _ipAddress;
var maxWidth = 75;
var debugPort = 9230;
let debug = minimist(process.argv.slice(2)).inspect || minimist(process.execArgv).inspect;
var args = process.argv.slice(1);

if (debug)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
else {
    network.get_active_interface(function (err, nw) {
        _ipAddress = nw.ip_address;
    });
}

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
    console.log(util.padRight(" Node.js version     : " + process.version, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" NPM package version : " + pjson.version, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" Architecture        : " + process.arch, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" Agent host          : " + settingsHelper.agentHost, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" Home directory      : " + settingsHelper.homeDirectory, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" NPM directory       : " + settingsHelper.nodePackagePath, maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" Licences            : https://microservicebus.com/licenses", maxWidth, ' ').bgBlue.white);
    console.log(util.padRight(" GIT repository      : https://github.com/axians/microservicebus-node", maxWidth, ' ').bgBlue.white);
    console.log(util.padRight("", maxWidth, ' ').bgBlue.white.bold);
    console.log(util.padRight(" For more information visit: http://microservicebus.com", maxWidth, ' ').bgBlue.white);
    console.log(util.padRight("", maxWidth, ' ').bgBlue.white.bold);
    console.log();

    checkVersionsAndStart(async (err) => {
        if (err) {
            if ((err.code === "ECONNREFUSED" ||
                err.code === "EACCES" ||
                err.code === "ENOTFOUND" ||
                err.code === "EAI_AGAIN") &&
                settingsHelper.settings.policies &&
                settingsHelper.settings.policies.disconnectPolicy.offlineMode) {

                console.log("Testing internet connection...")
                let internetConnectinon = await callUri("https://8.8.8.8");
                console.log(`...internet connection: ${internetConnectinon}`);

                console.log("Testing DNS...")
                let dnsResolve = await callUri("https://registry.npmjs.org");
                console.log(`...DNS: ${dnsResolve}`);

                if (!internetConnectinon) {
                    console.log('Starting in offline mode'.red);
                    try {
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
                    catch (ex) {
                        // This can happen if core has not been installed (or has been removed) and the gateway does not have internet access by the time 
                        // the snap starts up
                        process.kill(process.pid, 'SIGKILL');
                    }
                }
                else {
                    console.log("Not able to resolve DNS...rebooting in 5 minutes");
                    setTimeout(() => {
                        util.reboot();
                    }, 5 * 60 * 1000);
                }
            }
            else {
                console.log('Retrying...');
                setTimeout(() => {
                    process.kill(process.pid, 'SIGKILL');
                }, 5000);
            }
        }
    });

    var callUri = function (uri) {
        return new Promise((resolve) => {
            try {
                const req = https.get(uri);
                req.on('data', function (err) {
                    resolve(true);
                });
                req.on('error', function (err) {
                    resolve(false);
                });

            } catch (error) {
                resolve(false);
            }
        });
    }

    function checkVersionsAndStart(done) {
        async.waterfall([
            function (callback) { // Check version of microservicebus-node
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
                        }
                        console.log("Checked version from microservicebus-node");
                        callback();
                    })
                    .catch(function (err) {
                        console.log("General error checking version from microservicebus-node: " + err);
                        callback();
                    });
            },
            function (callback) { // Check version of microservicebus-core
                console.log("Check version of microservicebus-core");
                let microservicebusCore = "microservicebus-core";
                if (pjson.config && pjson.config.microservicebusCore) {
                    microservicebusCore = pjson.config.microservicebusCore;
                    //console.log("mSB.core: " + microservicebusCore);
                }
                checkVersion(microservicebusCore)
                    .then(function (rawData) {
                        try {
                            let path = require("path");
                            let packagePath;
                            let packageFile;

                            // Check if node is started as Snap
                            if (process.env["SNAP_USER_DATA"] != null) {
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
                                corePjson = util.requireNoCache(packageFile);
                                console.log(`microservicebus-core version: ${corePjson.version}`);
                            }

                            var isBeta = args.find(function (a) {
                                return a === "--beta";
                            });
                            var latest = rawData['dist-tags'].latest;
                            var beta = rawData['dist-tags'].beta;
                            var experimental = rawData['dist-tags'].experimental;
                            var coreVersion = latest;

                            if (isBeta) {
                                coreVersion = rawData['dist-tags'].beta;
                                console.log('RUNNING IN BETA MODE'.yellow);
                            }
                            else if (settingsHelper.settings.coreVersion) {
                                switch (settingsHelper.settings.coreVersion) {
                                    case "latest":
                                        coreVersion = latest;
                                        break;
                                    case "beta":
                                        coreVersion = beta;
                                        break;
                                    case "experimental":
                                        coreVersion = experimental;
                                        break;
                                    case "ignore":
                                        coreVersion = corePjson.version;
                                    default:
                                        coreVersion = settingsHelper.settings.coreVersion;
                                        break;
                                }
                            }
                            console.log(`Running ${coreVersion} mode`);
                            if (corePjson === undefined || util.compareVersion(corePjson.version, coreVersion) !== 0) {
                                var version = corePjson === undefined ? "NONE" : corePjson.version;
                                console.log();
                                console.log(util.padRight("", maxWidth, ' ').bgGreen.white.bold);
                                console.log(util.padRight(" New version of Core available. Performing update, please wait...", maxWidth, ' ').bgGreen.white.bold);
                                console.log(util.padRight(" Current version: " + version + ". New version: " + coreVersion, maxWidth, ' ').bgGreen.white.bold);
                                console.log(util.padRight("", maxWidth, ' ').bgGreen.white.bold);
                                console.log();

                                let corePkg = isBeta ? rawData.name + "@beta" : rawData.name + "@" + coreVersion;
                                let successfulUpdate = true;
                                let updateComplete = false;
                                setTimeout(() => {
                                    if (updateComplete) return;

                                    successfulUpdate = false;
                                    console.log(`Unable to install ${coreVersion} version of microservicebus-core. Restarting process.`.red);
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
                                console.log(`Running latest version`);
                                callback();
                            }
                        }
                        catch (err) {
                            console.log("Error checking version from microservicebus-core" + err);
                            callback(err);
                        }
                    })
                    .catch(function (err) {
                        console.log("General error checking version from microservicebus-core: " + err);
                        callback(err);
                    });
            }
        ],
            function (err) { // Starting microServiceBusHost
                console.log("Starting microServiceBusHost");
                // Add path to home directory to global paths
                require('app-module-path').addPath(settingsHelper.nodePackagePath);
                require('module').globalPaths.push(settingsHelper.nodePackagePath);

                if (err) {
                    console.log('ERROR: ' + err);
                    done(err);
                }
                else {
                    if (process.env["MSB_USE_IMEI"] == 'true') {
                        console.log("MSB_USE_IMEI === true");
                        process.argv.push("--imei");
                    }
                    let microservicebusCore = "microservicebus-core";
                    if (pjson.config && pjson.config.microservicebusCore) {
                        microservicebusCore = pjson.config.microservicebusCore;
                    }
                    console.log("Starting ".grey + microservicebusCore.grey);

                    let cachedFiles = Object.keys(require.cache).filter((c) => {
                        return true;//c.indexOf(microservicebusCore) >= 0;
                    });

                    cachedFiles.forEach((c) => {
                        delete require.cache[c];
                    });
                    console.log('require cache has been cleared'.grey);

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


