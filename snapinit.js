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

var SnapInitHandler = new SnapInitHandler(settingsHelper);

SnapInitHandler.start(settingsHelper.isFirstStart());

function SnapInitHandler(settingsHelper) {
    console.log("STARTSNAP: SnapInitHandler started");
    
    var self = this;
    this.interval = null;
    this.start = function (isFirstStart) {
        const argv = require('minimist')(process.argv.slice(2));
    
        const cOrNSupplied = (argv.c || argv.n)
        const cAndNSupplied = (argv.c && argv.n)
        
        if(!isFirstStart) {
            console.log('Stored data/settings for node exist.');
            // let's skip the confirmation dialog if the process argument '-y' is supplied.
            if(!('y' in argv)) {
                const readline = require('readline');
                
                const rl = readline.createInterface({
                  input: process.stdin,
                  output: process.stdout
                });

                if(!cOrNSupplied) {
                    console.warn("No '-c' (code) or '-n' node name argument specified. Only removing node data & settings.")
                }
        
                rl.question('Are you sure you want to remove all previous data and settings for mSB node? [yes/no] ', (answer) => {
                    if(!(answer.toLowerCase() == 'y' || answer.toLowerCase() == 'yes')) {
                        console.log("Exiting without resetting node data.");
                        rl.close();
                        process.exit(1);
                    }
                    else {
                        // Reset all node's settings & data.
                        resetNodeData();

                        // Only start node if '-c' or '-'n' was supplied.
                        if(cOrNSupplied) {
                            startNode();
                        }
                    }
                });
            }
            else {
                // '-y' argument supplied. Let's clean up all data and start node.
                resetNodeData();
                startNode();
            }
        }
        else {
            console.log('No stored data/settings for node exist. Nothing to clean.');
            if(cOrNSupplied) {
                startNode();
            }
        }
    }

    function resetNodeData() {
        // backup process arguments and let's apply them after resetting node.
        const mainArgv = process.argv;
                    
        // let's simulate the 'restore.js -all' command.
        process.argv = [ process.argv[0], process.argv[1], '-all'];
        console.log(JSON.stringify(process.argv));
        require('./restore.js');

        // restore argv's send to the snap.
        process.argv = mainArgv;                    
    }

    function startNode() {
        require('./start.js');
    }
}