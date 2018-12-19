// license-checker --json | node getlicenses.js
console.log("Hello");
const fs = require('fs');
const https = require('https');
var data = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    data += chunk;
});

process.stdin.on('end', function () {
    let licenses = processLicenses(data);
    let content = JSON.stringify(licenses, null,4)
    console.log(content);
    fs.writeFileSync('msb-licenses.json', content);
});

function processLicenses(data) {
    let licenses = JSON.parse(data);
    let msbLicenses = [];
    for (let pkg in licenses) {
        let license = licenses[pkg];
        var content = fs.readFileSync(license.licenseFile, 'utf8');
        let msbLicense ={
            package : pkg,
            licenses : license.licenses,
            repository : license.repository,
            publisher : license.publisher,
            email : license.email,
            url : license.url,
            license: content
        }
        msbLicenses.push(msbLicense);
    }
    return msbLicenses;
}