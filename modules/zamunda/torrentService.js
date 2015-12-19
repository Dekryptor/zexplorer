/*jslint node: true */
var http = require("http");
var Promise = require("bluebird");
var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv');
// Main modules
var TorrentParser = require('./TorrentParser'); // Return "class function" - use with `new`
var torrentTypeParser = require('./torrentTypes.js');
var uri = require('../uri');

var torrentService = (function() {
    "use strict";
    
    // Private
    
    // TODO: Cache some common results!
    // HTML parser operations are slow. Requests to zamunda.net too.
    var cache = {};
    
    var ZAMUNDA_URL = 'www.zamunda.net',
        ZAMUNDA_URI = 'http://www.zamunda.net';
    
    // Exposed

    /**
     * Get recommended torrents
     * @param  {String} cookies [Cookies for user authentication]
     * @return {Promise}         Promise that resolves with Array of torrents
     */
    var getRecommended = function getRecomenddedTorrents(cookies) {
        return new Promise(function(resolve, reject) {
            var options = {
                url: ZAMUNDA_URI + '/bananas',
                headers: {
                    cookie: cookies
                },
                encoding: 'binary'
            };

            request(options, function(err, res, body) {
                if (err) reject(err);

                body = new Buffer(body, 'binary');
                var conv = new iconv.Iconv('windows-1251', 'utf-8//IGNORE');
                var utf8_body = conv.convert(body).toString();

                var $ = cheerio.load(utf8_body);
                var torrentParser = new TorrentParser();
                var torrents = [];
                if (cookies.indexOf('uid=') === -1) {
                    torrents = torrentParser.parseTable($('.test.bottom tr'));
                } else {
                    torrents = torrentParser.parseTable($('#div1 tr'));
                }
                resolve(torrents);
            });
        });
    };

    /**
     * @param  {JSON} reqData [The data sent in the request]
     * @param  {String} cookies [Cookies for specific user]
     * @return {Promise}
     */
    var search = function search(reqData, cookies) {
        return new Promise(function(resolve, reject) {
            if (typeof reqData.searchString === 'undefined') {
                reject({status: 400, error: 'reqData.searchString is not defined'});
            }
            if (typeof reqData.page !== 'number') {
                reject({status: 400, error: 'Page must be a number'});
            }
            if (reqData.page > 30000) {
                reject({status: 400, error: 'The page cannot be accessed.'});
            }

            var options = {
                url: ZAMUNDA_URI + '/bananas',
                headers: {
                    cookie: cookies
                },
                qs: {
                    search: reqData.searchString,
                    page: reqData.page || 0, // Zamunda pages start from 0
                    field: 'name'
                },
                encoding: 'binary'
            };

            request(options, function(err, res, body) {
                if (err) reject(err);

                body = new Buffer(body, 'binary');
                var conv = new iconv.Iconv('windows-1251', 'utf-8//IGNORE');
                var utf8_body = conv.convert(body).toString();

                var $ = cheerio.load(utf8_body);
                var torrentParser = new TorrentParser();
                var torrents = torrentParser.parseTable($('.test.bottom tr'));
                var pagesEl = $('a[name="position"]').parent().find('font.red');
                var pagination = torrentParser.getPagination(pagesEl);
                resolve({
                    torrents: torrents,
                    pagination: pagination
                });
            });
        });
    };

    function getTorrentDescriptionHTML(url, cookies) {
        if (!url) throw new ReferenceError('url is not defined');

        return new Promise(function(resolve, reject) {
            var options = {
                url: url,
                headers: {
                    cookie: cookies
                },
                encoding: 'binary'
            };
            request(options, function(err, res, body){
                if (err) reject(err);

                body = new Buffer(body, 'binary');
                var conv = new iconv.Iconv('windows-1251', 'utf-8//IGNORE');
                var utf8_body = conv.convert(body).toString();

                resolve(utf8_body);
            });
        });
    }

    function autoComplete(str) {
        // TODO
    }
    
    

    return {
        getRecommended: getRecommended,
        getTorrentDescriptionHTML: getTorrentDescriptionHTML,
        search: search
    };
}());


module.exports = torrentService;