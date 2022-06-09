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

'use strict';
var exports = module.exports = {};
var fs = require('fs');
var path = require("path");
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
require('colors');
var rootFolder = process.arch == 'mipsel' ? '/mnt/sda1' : __dirname;
var runningInDebug = process.execArgv.find(function (a) { return a === "--debug" });
var node_path;
const { exec } = require('child_process');
var self = this;

exports.padLeft = function (nr, n, str) {
    if (nr.length > n)
        nr = nr.substring(0, n);

    return Array(n - String(nr).length + 1).join(str || '0') + nr;
};

exports.padRight = function (nr, n, str) {
    if (nr != undefined && nr.length > n)
        nr = nr.substring(0, n);

    return nr + Array(n - String(nr).length + 1).join(str || '0');
};

exports.mkdir = function (dir, callback) {
    fs.mkdirParent(dir, null, callback);
};

exports.encrypt = function (buffer, password) {
    password = password == undefined ? process.env["NODESECRET"] : password;
    if (password == undefined) {
        throw "Node is configured to use encryption, but no secret has been configured. Add an environment variable called 'NODESECRET and set the value to your secret.".bgRed;
    }

    var cipher = crypto.createCipher(algorithm, password)
    var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted;
};

exports.decrypt = function (buffer, password) {
    password = password == undefined ? process.env["NODESECRET"] : password;
    if (password == undefined) {
        throw "Node is configured to use encryption, but no secret has been configured. Add an environment variable called 'NODESECRET and set the value to your secret.".bgRed;
    }
    var algorithm = 'aes-256-ctr';
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return dec;
};

exports.requireNoCache = function (moduleName) {
    delete require.cache[require.resolve(moduleName)];
    return require(moduleName);
}

exports.addNpmPackage = function (npmPackage, force, callback) {
    const SettingsHelper = require("./SettingsHelper.js");
    const settingsHelper = new SettingsHelper();
    const cmd = `npm install ${npmPackage} --unsafe-perm --prefix ${settingsHelper.homeDirectory}`;

    if (callback) {
        try {
            this.removeNpmPackage(npmPackage, (err) => {
                if (err) {
                    callback(err);
                }
                else {
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            callback(`Unable to install ${npmPackage}: ${error}`);
                        } else {
                            callback();
                            console.log(`${npmPackage} installed`);

                        }
                    });
                }
            });
        }
        catch (error) {
            callback(`Unable to install ${npmPackage}: ${error}`);
        }
    }
    else {
        return new Promise(async (resolve, reject) => {
            try {
                if (force) {
                    try {
                        await this.removeNpmPackage(npmPackage);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }

                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Unable to install ${npmPackage}: ${error}`);
                    } else {
                        resolve();
                        console.log(`${npmPackage} installed`);

                    }
                });
            }
            catch (e) {
                reject(`Unable to install ${npmPackage}: ${e}`);
            }
        });
    }
};

exports.addNpmPackages = function (npmPackages, logOutput, callback) {
    npmPackages = npmPackages.split(",").map(p => p.trim()).join(" ");
    const SettingsHelper = require("./SettingsHelper.js");
    const settingsHelper = new SettingsHelper();
    const cmd = `npm install ${npmPackages} --unsafe-perm --prefix ${settingsHelper.homeDirectory}`;
    try {
        this.removeNpmPackage(npmPackages, (err) => {
            if (err) {
                callback(err);
            }
            else {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        callback(`Unable to install ${npmPackages}: ${error}`);
                    } else {
                        callback();
                        console.log(`${npmPackages} installed`);

                    }
                });
            }
        });
    }
    catch (error) {
        callback(`Unable to install ${npmPackages}: ${error}`);
    }
};

exports.removeNpmPackage = function (npmPackage, callback) {
    try {
        const cmd = `npm uninstall ${npmPackage}`;

        if (callback) {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    callback(er);
                } else {
                    callback();
                    console.log(`${npmPackage} removed`);
                }
            });
        }
        else {
            return new Promise((resolve, reject) => {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Unable to remove ${npmPackage}: ${error}`);
                    } else {
                        resolve();
                        console.log(`${npmPackage} removed`);
                    }
                });
            });
        }
    }
    catch (e) {
        reject(`Unable to remove ${npmPackage}: ${error}`);
    }
};

exports.getVersionNpmPackage = function (npmPackage, callback) {
    const cmd = `npm list ${npmPackage} --json`;

    if (callback) {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                callback(`Unable to get version of ${npmPackage}: ${error}`);
            } else {
                const pkg = JSON.parse(stdout);
                callback(null, pkg.dependencies[npmPackage].version);

            }
        });
    }
    else {
        return new Promise(async (resolve, reject) => {
            try {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Unable to install ${npmPackage}: ${error}`);
                    } else {
                        const pkg = JSON.parse(stdout);
                        resolve(pkg.dependencies[npmPackage].version);

                    }
                });
            }
            catch (e) {
                reject(`Unable to install ${npmPackage}: ${e}`);
            }
        });
    }
};

exports.compareVersion = function (a, b) {
    var i;
    var len;

    if (typeof a + typeof b !== 'stringstring') {
        return false;
    }

    a = a.split('.');
    b = b.split('.');
    i = 0;
    len = Math.max(a.length, b.length);

    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
            return -1;
        }
    }

    return 0;
};

exports.reboot = function (a, b) {
    var sys = require('util')
    var exec = require('child_process').exec;
    exec("sudo reboot", function (error, stdout, stderr) {
        console.log(`error: ${error}`);
        console.log(`stderr: ${stderr}`)
    });
};

