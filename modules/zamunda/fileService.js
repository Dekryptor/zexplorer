var request = require('request');
var logger = require('../simple-logger');
var os = require('os');

var fileService = (function() {

    // Exposed

    function respondFile(url, cookies, resObj) {
        var options = {
            method: 'GET',
            url: url,
            headers: {
                cookie: cookies
            }
        };

        request(options)
        .on('error', function(err) {
            logger.warn(os.EOL + url + os.EOL + err.toString() + os.EOL + err.stack);
        })
        .pipe(resObj);
    }


    return {
        respondFile: respondFile
    };
}());

module.exports = fileService;