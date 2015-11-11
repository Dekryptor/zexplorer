var cheerio = require('cheerio');
var uri = require('../uri');
var torrentTypeParser = require('./torrentTypes.js');

function Parser(html) {
    if (html) {
        try {
            this.cache = cheerio.load(html);
        } catch (e) {
            throw new Error('cheerio cannot load the given html and torrent parsing cannot continue');
        }
    }

    this.ZAMUNDA_URL = 'www.zamunda.net';
    this.ZAMUNDA_URI = 'http://www.zamunda.net';
}
Parser.prototype._ifSizeReturnSize = function(str) {
    if (!str) return undefined;

    if (str.indexOf(' GB') !== -1 ||
        str.indexOf(' MB' !== -1) ||
        str.indexOf(' KB' !== -1)) {
        return str;
    } else {
        return false;
    }
};
Parser.prototype._parseTable = function(tableRows) {
    if (!tableRows) throw new ReferenceError('tableRows is not defined');

    var that = this;

    var torrents = [];
    tableRows.each(function(i, tr) {
        if (i === 0) return true; // continue; (first tr is playing role for th)

        var rowDatas = cheerio(tr).find('td');

        // This try catch construction is used to indentify which is correct
        // element that containing the rating image.
        // Different cases (different tables / login tables / guest tables)
        // are presented in different ways
        var rating;
        try {
            rating = uri.getFileName(rowDatas.eq(2).find('img').attr('src'), true) | 0;
        } catch (e) {
            try {
                rating = uri.getFileName(rowDatas.eq(3).find('img').attr('src'), true) | 0;
            } catch (e) {
                throw e;
            }
        }

        var size = that._ifSizeReturnSize(rowDatas.eq(3).text()) ||
            that._ifSizeReturnSize(rowDatas.eq(5).text());


        torrents.push({
            type: torrentTypeParser.getType(rowDatas.eq(0).find('img').attr('src')),
            name: rowDatas.eq(1).find('a > b').text(),
            url: 'http://' + that.ZAMUNDA_URL + rowDatas.eq(1).find('a').attr('href'),
            rating: rating,
            size: size,
            /* While not logged in - seeds td is not presented in the response from zamunda */
            seeds: rowDatas.eq(7).find('font').text() || undefined
        });

    });

    return torrents;

};

// Public

/**
 * Parse torrents table rows to JSON object
 * @param  {cheerio Object} tableRows [The table rows wrapped in cheerio]
 * @return {Array} torrents [Array with object representing each torrent]
 */
Parser.prototype.parseTable = function(tableRows) {
    return this._parseTable(tableRows);
};

module.exports = Parser;