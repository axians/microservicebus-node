
/* jshint node: true */
/* jshint esversion: 6 */
/* jshint strict:false */
'use strict'; /* global describe, it */

var path = require('path');
var initialArgs = process.argv[1];
process.argv[1] = path.resolve(__dirname, "../start.js");
var mocha = require('mocha');
var expect = require('chai').expect;
var assert = require('assert');
var request = require('supertest');
var express = require('express');
var should = require('should');
var fs = require('fs');
var SCRIPTFOLDER = path.resolve(process.env.HOME, "microServiceBus/services");
var util = require("../node_modules/microservicebus-core/lib/utils.js");
var MicroServiceBusHost = require("../node_modules/microservicebus-core/lib/MicroServiceBusHost.js");
var SettingsHelper = require("../lib/SettingsHelper.js");
var settingsHelper = new SettingsHelper();
var org = process.env.organizationid;

var settings;
var loggedInComplete1;
var microServiceBusHost;

describe('Util functions', function () {
    
    it('padRight should work', function (done) {

        var t = util.padRight("microServiceBus.com", 25, ' ');
        expect(t).to.equal("microServiceBus.com      ");
        done();
    });
    it('padLeft should work', function (done) {

        var t = util.padLeft("microServiceBus.com", 25, ' ');
        expect(t).to.equal("      microServiceBus.com");
        done();
    });
    it('addNpmPackage (msbcam) should work', function (done) {
        this.timeout(30000);
        util.addNpmPackage("msbcam", function (err) {
            expect(err).to.equal(null);   
            done();
        });
    });
    it('compare same version should work', function (done) {

        var r = util.compareVersion("1.0.0", "1.0.0")
        expect(r).to.equal(0);
        done();
    });
    it('compare greater version should work', function (done) {

        var r = util.compareVersion("1.0.0", "1.0.1")
        expect(r).to.equal(-1);
        done();
    });
    it('compare earlier version should work', function (done) {

        var r = util.compareVersion("1.0.2", "1.0.1")
        expect(r).to.equal(1);
        done();
    });
    
});

describe('Encryption/Decryption', function () {
    var dataToEncrypt = "Some data";
    var encryptedBuffer;

    it('Encryption should work', function (done) {

        var dataToEncrypt = "Some data";
        encryptedBuffer = util.encrypt(new Buffer(dataToEncrypt), "secret");
        done();
    });
    it('Decryption should work', function (done) {

        var decryptedBuffer = util.decrypt(encryptedBuffer, "secret");
        var str = decryptedBuffer.toString('utf8');

        if (str != dataToEncrypt)
            throw "Encryption/Decryption failed";

        done();
    });
});

describe('Check configuration', function () {
    it('ENV organizationId should be set', function (done) {
        var orgId = process.env.organizationId;
        expect(orgId).to.not.be.null;

        done();
    });
});

describe('Sign in', function () {
    it('Save settings should work', function (done) {
        settings = {
            "hubUri": "wss://microservicebus.com",
            "trackMemoryUsage": 0,
            "enableKeyPress": false,
            "useEncryption": false,
            "log": "",
            "nodeName": "TestNode1",
            "organizationId": process.env.organizationid,
            "machineName": "DESKTOP-JPUK8UG",
            "id": "f3760331-1097-4507-ba26-6473576ce305",
            "sas": "SharedAccessSignature sr=65b22e1f-a17e-432f-b9f2-b7057423a786&sig=Xn2U%2bDkDaIlv%2fQQCcPlVVn3r073KgcSY4NYIk5Y5WJk%3d&se=1840172863&skn=TestNode1",
            "port": 9090
        };
        settingsHelper.settings = settings;
        settingsHelper.save();
        //util.saveSettings(settings);
        done();
    });
    it('Create microServiceBus Node should work', function (done) {
        loggedInComplete1 = false;
        microServiceBusHost = new MicroServiceBusHost(settingsHelper);
        expect(microServiceBusHost).to.not.be.null;
        done();
    });
    it('Sign in should work', function (done) {
        this.timeout(60000);
        microServiceBusHost.OnStarted(function (loadedCount, exceptionCount) {
            expect(exceptionCount).to.eql(0);
            expect(loadedCount).to.eql(1);
            done();
        });
        microServiceBusHost.OnStopped(function () {

        });
        microServiceBusHost.OnUpdatedItineraryComplete(function () {

        });
        try {
            microServiceBusHost.Start();

        }
        catch (er) {
            expect(err).to.be.null;
            done();
        }

    });
    it('Ping should work', function (done) {
        var r = microServiceBusHost.TestOnPing("test");
        expect(r).to.equal(true);
        done();
    });
    it('Change Debug state should work', function (done) {
        var r = microServiceBusHost.TestOnChangeDebug(true);
        expect(r).to.equal(true);
        done();
    });
});

describe('Post Signin', function () {
    it('azureApiAppInboundService.js should exist after login', function (done) {
        var filePath = path.resolve(SCRIPTFOLDER, "azureApiAppInboundService.js");
        var ret = fs.statSync(filePath);
        ret.should.be.type('object');

        done();
    });
    it('calling test should work', function (done) {
        this.timeout(5000);
        var url = 'http://localhost:9090';

        request(url)
            .get('/api/data/azureApiAppInboundService1/test')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)//Status code
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property('result');
                res.body.result.should.equal(true);
                console.log("GET Complete");
                //done();
                request(url)
                    .delete('/api/data/azureApiAppInboundService1/test')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200)//Status code
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.body.should.have.property('result');
                        res.body.result.should.equal(true);
                        console.log("DELETE Complete");
                        request(url)
                            .post('/api/data/azureApiAppInboundService1/test')
                            .send({ name: 'Manny', species: 'cat' })
                            .expect('Content-Type', /json/)
                            .expect(200)//Status code
                            .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                res.body.should.have.property('result');
                                res.body.result.should.equal(true);
                                console.log("POST Complete");
                                request(url)
                                    .put('/api/data/azureApiAppInboundService1/test')
                                    .send({ name: 'Manny', species: 'cat' })
                                    .expect('Content-Type', /json/)
                                    .expect(200)//Status code
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }
                                        res.body.should.have.property('result');
                                        res.body.result.should.equal(true);
                                        console.log("PUT Complete");
                                        done();
                                    });
                            });
                    });
            });
    });
    it('javascriptaction.js should exist after calling service', function (done) {
        var filePath = path.resolve(__dirname, SCRIPTFOLDER, "javascriptaction.js");

        var ret = fs.statSync(filePath);
        ret.should.be.type('object');
        done();
    });
    it('ping should work', function (done) {
        var pingResponse = microServiceBusHost.TestOnPing("");
        pingResponse.should.equal(true);
        done();
    });
    it('change debug state should work', function (done) {
        var TestOnChangeDebugResponse = microServiceBusHost.TestOnChangeDebug(false);
        TestOnChangeDebugResponse.should.equal(true);
        done();
    });
    //it('update itinerary should work', function (done) {
    //    this.timeout(10000);
    //    var testData = require('./testData.js');
    //    var updatedItinerary = testData.updateItinerary();
    //    microServiceBusHost.OnUpdatedItineraryComplete(function () {
    //        done();
    //    });
    //    var TestOnUpdateItineraryResponse = microServiceBusHost.TestOnUpdateItinerary(updatedItinerary);
    //});
    it('change state should work', function (done) {
        var TestOnChangeDebugResponse = microServiceBusHost.TestOnChangeState("Stop");
        done();
    });
}); 

describe('Clean up', function () {
    
    it('removeNpmPackage (msbcam) should work', function (done) {
        this.timeout(30000);
        util.removeNpmPackage("msbcam", function (err) {
            expect(err).to.be.null;
            done();
        });
    });
});
