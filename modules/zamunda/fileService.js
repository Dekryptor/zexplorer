var request = require('request');

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

        request(options).pipe(resObj);
    }


    return {
        respondFile: respondFile
    };
}());

module.exports = fileService;