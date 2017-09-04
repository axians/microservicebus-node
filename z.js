'use strict';
var colors = require('colors');

var signalR = require('./lib/signalR.js');
var log  = console.log;
log("lets go");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var client = new signalR.client(
    'wss://localhost:44302/signalR',
    ['integrationHub'],
    10, //optional: retry timeout in seconds (default: 10)
    true
);

client.serviceHandlers = {
    bound: function () {
        log("Connection: " + "bound".yellow);
    },
    connectFailed: function (error) {
        log("Connection: " + "Connect Failed: ".red);

    },
    connected: function (connection) {
        log("Connection: " + "Connected".green);

    },
    disconnected: function () {

        log("Connection: " + "Disconnected".yellow);
        
    },
    onerror: function (error) {
        log("Connection: " + "Error: ".red, error);

    },
    messageReceived: function (message) {

    },
    bindingError: function (error) {
        log("Connection: " + "Binding Error: ".red, error);
    },
    connectionLost: function (error) {
        //_isWaitingForSignInResponse = false;
        log("Connection: " + "Connection Lost".red);
    },
    reconnected: void function (connection) {
        log("Connection: " + "Reconnected ".green);
    },
    reconnecting: function (retry /* { inital: true/false, count: 0} */) {
        log("Connection: " + "Retrying to connect ".yellow);
        return true;
    }
};
//function log(msg) {
//    console.log(msg);
//}
client.start();