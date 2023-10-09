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

const https = require('https');
var self = this;
function _get(options) {
    if (!options.method) options.method = "GET";
    
    return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(response);
            }
            let data = '';
            response.on('data', (chunk) => {
                data = data + chunk.toString();
            });

            response.on('end', () => {
                resolve(data);
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.end()
    });
};
function _post(options) {
    return new Promise((resolve, reject) => {

        if (!options.method) options.method = "POST";
        if (!options.headers) options.headers = {};
        if (!options.headers["Content-Type"]) options.headers["Content-Type"] = "application/json";
        if (!options.headers["Accept"]) options.headers["Accept"] = "application/json";
        if (!options.headers["Content-Length"]) options.headers["Content-Length"] = options.json.length;

        var request = https.request(options, (response) => {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(response);
            }
            const body = []
            response.on('data', (chunk) => body.push(chunk))
            response.on('end', () => {
                const resString = Buffer.concat(body).toString()
                resolve(resString)
            })
        });

        request.on('error', (e) => {
            reject(e);
        });

        request.write(options.json);
        request.end();

    });
};
function _request(options, callback) {
    const opt = this ? self.options : options;

    opt.attempts++;
    console.log(`test #${opt.attempts}`)

    switch (options.method) {
        case "PUT":
        case "POST":
            return _post(options, options.json)
                .then(ret => { callback(null, opt, ret); })
                .catch(err => { callback(err, err, null); });
        default:
            return _get(options)
                .then(ret => { callback(null, opt, ret); })
                .catch(err => { callback(err, err, null); });
    }
}
function request(options, callback) {
    // Set self.options for the first call
    if (!self.options) {
        if (typeof (options) === "string") {
            options = {
                url: options
            };
        }
        if (options.url) {
            const url = new URL(options.url);
            options.hostname = url.hostname;
            options.path = url.pathname;
            if (url.port !== '') {
                options.port = Number(url.port);
            }
        }
        options.method = options.method ? options.method : "GET"
        options.maxAttempts ? options.maxAttempts : 1;
        options.retryDelay ? options.retryDelay : 5000;
        options.attempts = 0
        options.callback = callback;
        self.options = options;
    }
    self._req = _request(self.options, async function (err, response, body) {
        if (response) {
            response.attempts = self.options.attempts;
        }

        if (err) {
            err.attempts = self.options.attempts;
        }

        var mustRetry = err != null;

        if (mustRetry && self.options.maxAttempts > self.options.attempts) {
            self._timeout = setTimeout(request.bind(self), self.options.retryDelay);
            return;
        }

        self.options.callback(err, response, body);
    }.bind(this));
}
module.exports = request;
