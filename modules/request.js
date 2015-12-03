var http = require('http');
var Promise = require('bluebird');
var querystring = require('querystring');


var request = (function(){

    // Private
    function parseResponseData(res) {
        // Array of response cookies.
        var cookies = res.headers['set-cookie'];

        res.setEncoding('utf8');
        return new Promise(function(resolve) {
            var response = '';
            res.on('data', function(chunk) {
                response += chunk;
            });
            res.on('end', function() {
                resolve({cookies: cookies, response: response});
            });
        });
    }

    // Exposed

    function get(options) {
        return new Promise(function(resolve, reject){
            http.get(options, function(res) {
                parseResponseData(res).then(resolve);
            }).on('error', reject);
        });
    }

    function post(options, dataObj) {
        if (!options.host) throw new Error('Host in post request options is not defined.');
        if (!dataObj) throw new Error('No POST data defined.');

        // Configure POST headers in options object
        var data = querystring.stringify(dataObj);
        options.method = 'POST';
        options['Content-Type'] = 'application/x-www-form-urlencoded';
        options['Content-Length'] = Buffer.byteLength(data);

        return new Promise(function(resolve, reject){
            var req = http.request(options, function(res) {
                parseResponseData(res).then(resolve);
            });
            req.on('error', reject);

            req.write(data);
            req.end();
        });
    }


    return {
        get: get,
        post: post
    };

}());

module.exports = request;
