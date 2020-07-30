﻿![alt](https://blogical.blob.core.windows.net/microservicebus/Logosmall.png)

[![Build Status](https://travis-ci.org/axians/microservicebus-node.svg?branch=dev)](https://travis-ci.org/axians/microservicebus-node)
[![microservicebus-node](https://snapcraft.io/microservicebus-node/badge.svg)](https://snapcraft.io/microservicebus-node)


# microservicebus-node
microServiceBus.com is an integration platform for IoT and enterprise applications. This platform lets you expose microservices from small devices and large systems using a remote hosting infrastructure. These nodes can run on both Linux and Windows using components built either natively (ARM) or using node.js.

[For more information about microServiceBus.com](https://microservicebus.com)

## To create your own service using microServiceBus.com.
Simply follow the template below. When your are done, simply save in the portal.

```javascript
/* 
 * Service template for node.js
 * 
 * To use this template, simply add your code in Start and Stop method
*/
var timerEvent; // In case you use a timer for fetching data
 
var exports = module.exports = {
    Start : function () {
     
        var base  = this;
        timerEvent = setInterval(function () {
            var message = {
                someRandomValue : Math.random() 
            };
                
            // Create an integration message using the CreateMessage 
            // method.
             base.SubmitMessage(message);  
             
        }, 3000);    
        
    },

    // The Stop method is called from the Host when the Host is 
    // either stopped or has updated integrations. 
    Stop : function () {
        // Stop the timerEvent
        clearInterval(timerEvent);
    },    
    
    // The Process method is called from the host as it receives 
    // messages from the hub. The [messasge] parameter is a JSON 
    // object (the payload) and the [context] parameter is a 
    // value/pair object with parameters provided by the hub.
    Process : function (message, context) {
        // TO DO! This is where you code for when a message is sent
        // to this host.
        
        
        var x = JSON.parse("<test/>");
        console.log('');
        console.log('The Process method is called.');
        var payload = JSON.stringify(message);
        console.log(payload);
        console.log('');
    },  
}


```
