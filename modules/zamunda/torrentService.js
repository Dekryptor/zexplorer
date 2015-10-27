/*jslint node: true */
var http = require("http");
var Promise = require("bluebird");
var cheerio = require('cheerio');
var request = require('request');

var torrentTypeParser = require('./torrentTypes.js');
var uri = require('../uri');
var rq = require('../request');

var torrentService = (function() {
    
    // Private

    var cache = {};
    
    var ZAMUNDA_URL = 'www.zamunda.net',
        ZAMUNDA_URI = 'http://www.zamunda.net';
    
    // Exposed

    var getRecommended = function getRecomenddedTorrents(cookies) {
        return new Promise(function(resolve, reject) {
            var options = {
                host: ZAMUNDA_URL,
                path: '/bananas'
            };

            rq.get(options).then(function(data) {
                var $ = cheerio.load(data.response);

                var torrents = [];
                $('#div1 tr').each(function(i, tr) {
                    if (i === 0) return true; // continue; (first tr is playing role for th)

                    var rowDatas = $(tr).find('td');
                    torrents.push({
                        type: torrentTypeParser.getType(rowDatas.eq(0).find('img').attr('src')),
                        name: rowDatas.eq(1).find('a > b').text(),
                        url: ZAMUNDA_URL + rowDatas.eq(1).find('a').attr('href'),
                        rating: uri.getFileName(rowDatas.eq(2).find('img').attr('src'), true),
                        size: rowDatas.eq(3).text(),
                        peers: rowDatas.eq(4).text()
                    });
                });

                resolve(torrents);
            }, reject);
        });
    };

    /**
     * @param  {JSON} obj [JSON representation of query string search options for zamunda]
     * @param  {Not choisen yet} cookies [Cookies for specific user]
     * @return {Promise}
     */
    var search = function search(obj, cookies) {
        return new Promise(function(resolve, reject) {
            var options = {
                url: ZAMUNDA_URI + '/bananas',
                qs: obj
            };

            request(options, function(err, res, body) {
                if (err) reject(err);

                var $ = cheerio.load(body);

                var torrents = [];
                $('.test.bottom tr').each(function(i, tr) {
                    if (i === 0) return true; // continue; (first tr is playing role for th)

                    var rowDatas = $(tr).find('td');

                    torrents.push({
                        type: torrentTypeParser.getType(rowDatas.eq(0).find('img').attr('src')),
                        name: rowDatas.eq(1).find('a > b').text(),
                        url: ZAMUNDA_URL + rowDatas.eq(1).find('a').attr('href'),
                        rating: uri.getFileName(rowDatas.eq(3).find('img').attr('src'), true),
                        size: rowDatas.eq(5).text(), 
                        /* While not logged in - seeds td is not presented in the response from zamunda */
                        seeds: rowDatas.eq(7).find('font').text() || undefined
                    });
                });

                resolve(body);
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