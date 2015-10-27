var http = require("http");
var Promise = require("bluebird");
var cheerio = require('cheerio');
var request = require('request');

var auth = (function() {

	// Private

    /**
     * @param  {Array} cookies
     * @return {Boolean}
     */
    function isLoginSuccessed(cookies) {
        var isLoggedIn = false;
        for (var i in cookies) {
            if (cookies[i].indexOf('uid') !== -1) {
                isLoggedIn = true;
                break;
            }
        }
        return isLoggedIn;
    }

	// Exposed

    /**
     *  Attempt to login into zamunda.net account. Return Promise which
     *  resolve with cookies array if successed. Reject with JSON object
     *  if not.
     * 
     * @param  {JSON} credentials [JSON format: {"username": "name", "password": "secret"}]
     * @return {Promise}
     */
    function login(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
            var errorMessage = 'Login credentials missing data. Given data: credentials = ' +
                credentials;
            throw new Error(errorMessage);
        }

        var options = {
            url: 'http://www.zamunda.net/takelogin.php',
            method: 'POST',
            form: credentials
        };

        return new Promise(function(resolve, reject) {
            request(options, function(err, res) {
                if (err) throw new Error('Error occured while logging in.');

                var cookies = res.headers['set-cookie'];
                if (isLoginSuccessed(cookies)) {
                    resolve(cookies);
                }
                else {
                    reject({
                        status: 401,
                        messageEN: 'An error occured while logging you into your zamunda account.',
                        messageBG: 'Възникна грешка при логването в замунда акаунта ви.'
                    });
                }
            });
        });
    }

	return {
        login: login
	};

}());

module.exports = auth;