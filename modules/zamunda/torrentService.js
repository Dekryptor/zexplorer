/*jslint node: true */
var http = require("http");
var Promise = require("bluebird");
var cheerio = require('cheerio');
var request = require('request');
var TorrentParser = require('./TorrentParser'); // Return "class function" - use with `new`
var torrentTypeParser = require('./torrentTypes.js');
var uri = require('../uri');

var torrentService = (function() {
    
    // Private

    var cache = {};
    
    var ZAMUNDA_URL = 'www.zamunda.net',
        ZAMUNDA_URI = 'http://www.zamunda.net';
    
    // Exposed

    /**
     * Get recommended torrents
     * @param  {Not choisen yet} cookies [Cookies for user authentication]
     * @return {[type]}         [description]
     */
    var getRecommended = function getRecomenddedTorrents(cookies) {
        return new Promise(function(resolve, reject) {
            var options = {
                url: ZAMUNDA_URI + '/bananas',
                headers: {
                    cookie: cookies || null
                }
            };

            request(options, function(err, res, body) {
                if (err) reject(err);

                var $ = cheerio.load(body);
                var torrentParser = new TorrentParser();
                var torrents = torrentParser.parseTable($('#div1 tr'));
                resolve(torrents);
            });
        });
    };

    /**
     * @param  {JSON} queryObj [Representation of query string for ?search zamunda request]
     * @param  {Not choisen yet} cookies [Cookies for specific user]
     * @return {Promise}
     */
    var search = function search(queryObj, cookies) {
        return new Promise(function(resolve, reject) {
            var options = {
                url: ZAMUNDA_URI + '/bananas?search=' + queryObj.searchStr + '&field=name',
                headers: {
                    cookie: cookies
                }
            };

            request(options, function(err, res, body) {
                if (err) reject(err);

                var $ = cheerio.load(body);
                var torrentParser = new TorrentParser();
                var torrents = torrentParser.parseTable($('.test.bottom tr'));
                resolve(torrents);
            });
        });
    };

    function autoComplete(str) {
        // TODO
    }
    
    

    return {
        getRecommended: getRecommended,
        search: search
    };
}());


module.exports = torrentService;