

var exports = module.exports = {};

exports.updateItinerary = function () {
  var response = {
    "itineraryId": "15d5667f-34f2-44ed-937c-9c0ddb6e92ca",
    "variables": [],
    "activities": [
      {
        "type": "twowayreceiveadapter",
        "id": "6bebb9f1-e93e-5fcb-eb65-ddc00942435e",
        "x": 77,
        "y": 123,
        "width": 50,
        "height": 50,
        "alpha": 1,
        "userData": {
          "id": "azureApiAppInboundService1",
          "type": "azureApiAppInboundService",
          "baseType": "twowayreceiveadapter",
          "assemblyType": null,
          "title": "Azure API App Inbound Service",
          "description": null,
          "image": "../../Images/svg/ApiApInboundService.svg",
          "host": null,
          "config": {
            "generalConfig": [
              {
                "category": "Misc",
                "id": "name",
                "order": 0,
                "name": "Name",
                "description": "Name of service",
                "value": "azureApiAppInboundService1",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": "Misc",
                "id": "description",
                "order": 1,
                "name": "Description",
                "description": null,
                "value": "Describe your service",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": "Misc",
                "id": "host",
                "order": 2,
                "name": "Node",
                "description": "Which node would you want to handle this service?",
                "value": "TestNode1",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "enabled",
                "order": 3,
                "name": "Enabled",
                "description": "Activate the service",
                "value": true,
                "type": "bool",
                "visible": false,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "correlationId",
                "order": 99,
                "name": "Correlation Id",
                "description": "Set by server to create a unique identifier of the instance.",
                "value": null,
                "type": "string",
                "visible": true,
                "acceptableValues": []
              }
            ],
            "staticConfig": [
              {
                "category": null,
                "id": "uri",
                "order": 0,
                "name": "URI",
                "description": "Relative service address",
                "value": "/test",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "verb",
                "order": 2,
                "name": "HTTP Verb",
                "description": "HTTP Verb, Eg POST, PUT",
                "value": "GET",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "accept",
                "order": 3,
                "name": "Accept Header",
                "description": "Accepted content type",
                "value": "application/json",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "contenttype",
                "order": 4,
                "name": "Content Type Header",
                "description": "Content type of the messae submitted",
                "value": "application/json",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              }
            ],
            "dynamicConfig": [],
            "securityConfig": [
              {
                "category": null,
                "id": "userName",
                "order": 0,
                "name": "Username",
                "description": "Username",
                "value": null,
                "type": "String",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "password",
                "order": 1,
                "name": "Password",
                "description": "Password",
                "value": null,
                "type": "String",
                "visible": true,
                "acceptableValues": []
              }
            ]
          },
          "integrationId": "27e51a36-229a-45fd-bd57-f91a13929bdb",
          "itineraryId": "15d5667f-34f2-44ed-937c-9c0ddb6e92ca",
          "handler": null,
          "kendoDraggable": null,
          "role": "draggable",
          "bind": "attr:{id: $data.type}",
          "isCustom": false
        },
        "cssClass": "twowayreceiveadapter",
        "bgColor": "#333333",
        "color": "#1B1B1B",
        "stroke": 0,
        "radius": 0
      },
      {
        "type": "javascriptaction",
        "id": "58c7aea7-ce2e-5bd0-8c19-2200c28ba314",
        "x": 268,
        "y": 89,
        "width": 50,
        "height": 50,
        "alpha": 1,
        "userData": {
          "id": "javascriptaction1",
          "type": "javascriptaction",
          "baseType": "javascriptaction",
          "assemblyType": null,
          "title": "Javascript",
          "description": null,
          "image": "../../Images/svg/JavaScriptAction.svg",
          "host": null,
          "config": {
            "generalConfig": [
              {
                "category": "Misc",
                "id": "name",
                "order": 0,
                "name": "Name",
                "description": "Name of service",
                "value": "javascriptaction1",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": "Misc",
                "id": "description",
                "order": 1,
                "name": "Description",
                "description": null,
                "value": "Executes javascripts",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": "Misc",
                "id": "host",
                "order": 2,
                "name": "Node",
                "description": "Which node would you want to handle this service?",
                "value": "TestNode1",
                "type": "string",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "enabled",
                "order": 3,
                "name": "Enabled",
                "description": "Activate the service",
                "value": true,
                "type": "bool",
                "visible": true,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "correlationId",
                "order": 99,
                "name": "Correlation Id",
                "description": "Set by server to create a unique identifier of the instance.",
                "value": null,
                "type": "string",
                "visible": true,
                "acceptableValues": []
              }
            ],
            "staticConfig": [
              {
                "category": null,
                "id": "script",
                "order": 0,
                "name": "Script",
                "description": "Java script",
                "value": "/* Use the message object*/\nvar moment = require('moment');\nvar time = moment();\nvar utcNow = time.utc().format('YYYY-MM-DD HH:mm:ss.SSSS');\nmessage.result = true;\nmessage.timeStamp = utcNow;",
                "type": "script",
                "visible": false,
                "acceptableValues": []
              },
              {
                "category": null,
                "id": "routingExpression",
                "order": 99,
                "name": "Routing expression",
                "description": "Set by server to persist routing instructions",
                "value": "// This expression is evaluated on the 'route' variable.\r\nvar route = true;",
                "type": "script",
                "visible": false,
                "acceptableValues": []
              }
            ],
            "dynamicConfig": [],
            "securityConfig": []
          },
          "integrationId": "27e51a36-229a-45fd-bd57-f91a13929bdb",
          "itineraryId": "15d5667f-34f2-44ed-937c-9c0ddb6e92ca",
          "handler": null,
          "kendoDraggable": null,
          "role": "draggable",
          "bind": "attr:{id: $data.type}",
          "isCustom": false
        },
        "cssClass": "javascriptaction",
        "bgColor": "#333333",
        "color": "#1B1B1B",
        "stroke": 0,
        "radius": 0
      },
      {
        "type": "draw2d.Connection",
        "id": "f22809c3-c669-f9cd-9aab-7c337a774b4d",
        "alpha": 1,
        "userData": {},
        "cssClass": "draw2d_Connection",
        "stroke": 1,
        "color": "#1B1B1B",
        "outlineStroke": 0,
        "outlineColor": "none",
        "policy": "draw2d.policy.line.LineSelectionFeedbackPolicy",
        "router": "draw2d.layout.connection.ManhattanConnectionRouter",
        "radius": 2,
        "source": {
          "node": "6bebb9f1-e93e-5fcb-eb65-ddc00942435e",
          "port": "hybrid0"
        },
        "target": {
          "node": "58c7aea7-ce2e-5bd0-8c19-2200c28ba314",
          "port": "input0"
        }
      },
      {
        "type": "draw2d.Connection",
        "id": "c80f2ed2-c146-3cf5-6472-65c19a90e5de",
        "alpha": 1,
        "userData": {},
        "cssClass": "draw2d_Connection",
        "stroke": 1,
        "color": "#1B1B1B",
        "outlineStroke": 0,
        "outlineColor": "none",
        "policy": "draw2d.policy.line.LineSelectionFeedbackPolicy",
        "router": "draw2d.layout.connection.ManhattanConnectionRouter",
        "radius": 2,
        "source": {
          "node": "58c7aea7-ce2e-5bd0-8c19-2200c28ba314",
          "port": "output0"
        },
        "target": {
          "node": "6bebb9f1-e93e-5fcb-eb65-ddc00942435e",
          "port": "hybrid1"
        }
      }
    ],
    "changed": "2015-12-13T13:05:15.4793496Z",
    "integrationName": "Test001",
    "environment": "Stage",
    "trackingLevel": "None"
  }
  return response;
};

var response = {
  "itineraryId": "15d5667f-34f2-44ed-937c-9c0ddb6e92ca",
  "variables": [ ],
  "activities": [
    {
      "type": "twowayreceiveadapter",
      "id": "6bebb9f1-e93e-5fcb-eb65-ddc00942435e",
      "x": 77,
      "y": 123,
      "width": 50,
      "height": 50,
      "alpha": 1,
      "userData": {
        "id": "azureApiAppInboundService1",
        "type": "azureApiAppInboundService",
        "baseType": "twowayreceiveadapter",
        "assemblyType": null,
        "title": "Azure API App Inbound Service",
        "description": null,
        "image": "../../Images/svg/ApiApInboundService.svg",
        "host": null,
        "config": {
          "generalConfig": [
            {
              "category": "Misc",
              "id": "name",
              "order": 0,
              "name": "Name",
              "description": "Name of service",
              "value": "azureApiAppInboundService1",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": "Misc",
              "id": "description",
              "order": 1,
              "name": "Description",
              "description": null,
              "value": "Describe your service",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": "Misc",
              "id": "host",
              "order": 2,
              "name": "Node",
              "description": "Which node would you want to handle this service?",
              "value": "TestNode1",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "enabled",
              "order": 3,
              "name": "Enabled",
              "description": "Activate the service",
              "value": true,
              "type": "bool",
              "visible": false,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "correlationId",
              "order": 99,
              "name": "Correlation Id",
              "description": "Set by server to create a unique identifier of the instance.",
              "value": null,
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            }
          ],
          "staticConfig": [
            {
              "category": null,
              "id": "uri",
              "order": 0,
              "name": "URI",
              "description": "Relative service address",
              "value": "/test",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "verb",
              "order": 2,
              "name": "HTTP Verb",
              "description": "HTTP Verb, Eg POST, PUT",
              "value": "GET",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "accept",
              "order": 3,
              "name": "Accept Header",
              "description": "Accepted content type",
              "value": "application/json",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "contenttype",
              "order": 4,
              "name": "Content Type Header",
              "description": "Content type of the messae submitted",
              "value": "application/json",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            }
          ],
          "dynamicConfig": [ ],
          "securityConfig": [
            {
              "category": null,
              "id": "userName",
              "order": 0,
              "name": "Username",
              "description": "Username",
              "value": null,
              "type": "String",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "password",
              "order": 1,
              "name": "Password",
              "description": "Password",
              "value": null,
              "type": "String",
              "visible": true,
              "acceptableValues": [ ]
            }
          ]
        },
        "integrationId": "27e51a36-229a-45fd-bd57-f91a13929bdb",
        "itineraryId": "15d5667f-34f2-44ed-937c-9c0ddb6e92ca",
        "handler": null,
        "kendoDraggable": null,
        "role": "draggable",
        "bind": "attr:{id: $data.type}",
        "isCustom": false
      },
      "cssClass": "twowayreceiveadapter",
      "bgColor": "#333333",
      "color": "#1B1B1B",
      "stroke": 0,
      "radius": 0
    },
    {
      "type": "javascriptaction",
      "id": "58c7aea7-ce2e-5bd0-8c19-2200c28ba314",
      "x": 268,
      "y": 89,
      "width": 50,
      "height": 50,
      "alpha": 1,
      "userData": {
        "id": "javascriptaction1",
        "type": "javascriptaction",
        "baseType": "javascriptaction",
        "assemblyType": null,
        "title": "Javascript",
        "description": null,
        "image": "../../Images/svg/JavaScriptAction.svg",
        "host": null,
        "config": {
          "generalConfig": [
            {
              "category": "Misc",
              "id": "name",
              "order": 0,
              "name": "Name",
              "description": "Name of service",
              "value": "javascriptaction1",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": "Misc",
              "id": "description",
              "order": 1,
              "name": "Description",
              "description": null,
              "value": "Executes javascripts",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": "Misc",
              "id": "host",
              "order": 2,
              "name": "Node",
              "description": "Which node would you want to handle this service?",
              "value": "TestNode1",
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "enabled",
              "order": 3,
              "name": "Enabled",
              "description": "Activate the service",
              "value": true,
              "type": "bool",
              "visible": true,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "correlationId",
              "order": 99,
              "name": "Correlation Id",
              "description": "Set by server to create a unique identifier of the instance.",
              "value": null,
              "type": "string",
              "visible": true,
              "acceptableValues": [ ]
            }
          ],
          "staticConfig": [
            {
              "category": null,
              "id": "script",
              "order": 0,
              "name": "Script",
              "description": "Java script",
              "value": "/* Use the message object*/\nvar moment = require('moment');\nvar time = moment();\nvar utcNow = time.utc().format('YYYY-MM-DD HH:mm:ss.SSSS');\nmessage.result = true;\nmessage.timeStamp = utcNow;",
              "type": "script",
              "visible": false,
              "acceptableValues": [ ]
            },
            {
              "category": null,
              "id": "routingExpression",
              "order": 99,
              "name": "Routing expression",
              "description": "Set by server to persist routing instructions",
              "value": "// This expression is evaluated on the 'route' variable.\r\nvar route = true;",
              "type": "script",
              "visible": false,
              "acceptableValues": [ ]
            }
          ],
          "dynamicConfig": [ ],
          "securityConfig": [ ]
        },
        "integrationId": "27e51a36-229a-45fd-bd57-f91a13929bdb",
        "itineraryId": "15d5667f-34f2-44ed-937c-9c0ddb6e92ca",
        "handler": null,
        "kendoDraggable": null,
        "role": "draggable",
        "bind": "attr:{id: $data.type}",
        "isCustom": false
      },
      "cssClass": "javascriptaction",
      "bgColor": "#333333",
      "color": "#1B1B1B",
      "stroke": 0,
      "radius": 0
    },
    {
      "type": "draw2d.Connection",
      "id": "f22809c3-c669-f9cd-9aab-7c337a774b4d",
      "alpha": 1,
      "userData": { },
      "cssClass": "draw2d_Connection",
      "stroke": 1,
      "color": "#1B1B1B",
      "outlineStroke": 0,
      "outlineColor": "none",
      "policy": "draw2d.policy.line.LineSelectionFeedbackPolicy",
      "router": "draw2d.layout.connection.ManhattanConnectionRouter",
      "radius": 2,
      "source": {
        "node": "6bebb9f1-e93e-5fcb-eb65-ddc00942435e",
        "port": "hybrid0"
      },
      "target": {
        "node": "58c7aea7-ce2e-5bd0-8c19-2200c28ba314",
        "port": "input0"
      }
    },
    {
      "type": "draw2d.Connection",
      "id": "c80f2ed2-c146-3cf5-6472-65c19a90e5de",
      "alpha": 1,
      "userData": { },
      "cssClass": "draw2d_Connection",
      "stroke": 1,
      "color": "#1B1B1B",
      "outlineStroke": 0,
      "outlineColor": "none",
      "policy": "draw2d.policy.line.LineSelectionFeedbackPolicy",
      "router": "draw2d.layout.connection.ManhattanConnectionRouter",
      "radius": 2,
      "source": {
        "node": "58c7aea7-ce2e-5bd0-8c19-2200c28ba314",
        "port": "output0"
      },
      "target": {
        "node": "6bebb9f1-e93e-5fcb-eb65-ddc00942435e",
        "port": "hybrid1"
      }
    }
  ],
  "changed": "2015-12-13T13:05:15.4793496Z",
  "integrationName": "Test001",
  "environment": "Stage",
  "trackingLevel": "None"
}