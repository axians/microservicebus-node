
/* jshint node: true */
/* jshint esversion: 6 */
/* jshint strict:false */
'use strict'; /* global describe, it */

var path = require('path');
// var initialArgs = process.argv[1];
// process.argv[1] = path.resolve(__dirname, "../start.js");
 var mocha = require('mocha');
 var expect = require('chai').expect;
 var assert = require('assert');
// var request = require('supertest');
// var express = require('express');
 var should = require('should');
var fs = require('fs');
var SCRIPTFOLDER = path.resolve(process.env.HOME, "microServiceBus/services");
var util;// = require("../node_modules/microservicebus-core/lib/utils.js");
var MicroServiceBusHost;// = require("../node_modules/microservicebus-core/lib/MicroServiceBusHost.js");
var SettingsHelper;// = require("../lib/SettingsHelper.js");
var settingsHelper;// = new SettingsHelper();
var orgId;
var nodeKey;
var settings;
var loggedInComplete1;
var microServiceBusHost;

describe('mSB should work', function(){
    it('padRight should work', function (done) {
        util = require("../lib/Utils.js");
        var t = util.padRight("microServiceBus.com", 25, ' ');
        expect(t).to.equal("microServiceBus.com      ");
        done();
    });
    it('Save settings should work', function (done) {
        SettingsHelper = require("../lib/SettingsHelper.js");
        settingsHelper = new SettingsHelper();
        settings = {
            "hubUri": "wss://stage.microservicebus.com",
            "trackMemoryUsage": 0,
            "enableKeyPress": false,
            "useEncryption": false,
            "log": "",
            "nodeName": "unitTestNode1",
            "organizationId": process.env.organizationid,
            "machineName": "unitTestNode1",
            "id": "644424d1-b591-4fd0-b7c2-29736b2f51ac",
            "sas": process.env.nodeKey,
            "port": 9090
        };
        settingsHelper.settings = settings;
        settingsHelper.save();
        done();
    });
    it('Removing microServiceBus-core should work', function (done) {
        this.timeout(60000);
        util.removeNpmPackage("microservicebus-core",  function (err) {
            if (err) {
                console.log("Unable to remove core".bgRed.white);
                console.log("Error: " + err);
                throw err;
            }
            else {
                console.log("Core uninstalled successfully".bgGreen.white);
                done();
            }
        });
    });
    it('Downloading microServiceBus-core should work', function (done) {
        this.timeout(120000);
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
    });
    it('Create microServiceBus Node should work', function (done) {
        loggedInComplete1 = false;
        MicroServiceBusHost = require("../node_modules/microservicebus-core/lib/MicroServiceBusHost.js");
        microServiceBusHost = new MicroServiceBusHost(settingsHelper);
        expect(microServiceBusHost).to.not.be.null;
        done();
    });
});
