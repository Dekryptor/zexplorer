var cheerio = require('cheerio');
var uri = require('../uri');
var torrentTypeParser = require('./torrentTypes.js');

function Parser(html) {
    'use strict';
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

    if (str.indexOf('GB') !== -1 ||
        str.indexOf('MB') !== -1 ||
        str.indexOf('KB') !== -1) {
        return str;
    } else {
        return undefined;
    }
};
Parser.prototype._parseTable = function(tableRows) {
    "use strict";

    if (!tableRows) throw new ReferenceError('tableRows is not defined');

    var that = this;

    var torrents = [];
    tableRows.each(function(i, tr) {
        if (i === 0) return true; // continue; (first tr is playing role for th)

        var rowDatas = cheerio(tr).find('td');

        // This try catch construction is used to indentify which is correct
        // element that containing the rating image.
        // Different cases (different tables / user tables / guest tables)
        // are presented in different ways
        var rating;
        try {
            rating = uri.getFileName(rowDatas.eq(2).find('img').attr('src'), true) | 0;
        } catch (e) {
            try {
                rating = uri.getFileName(rowDatas.eq(3).find('img').attr('src'), true) | 0;
            } catch (ex) {
                try {
                    rating = uri.getFileName(rowDatas.eq(4).find('img').attr('src'), true) | 0;
                }
                catch (exeption) {
                    rating = 0;
                }
            }
        }

        var size = that._ifSizeReturnSize(rowDatas.eq(3).text()) ||
            that._ifSizeReturnSize(rowDatas.eq(5).text());

        var seeds = rowDatas.eq(7).find('font').text() ||
            rowDatas.eq(7).find('.red').text() || 
            undefined;

        var path = rowDatas.eq(1).find('a').attr('href');
        if (path[0] != '/') {
            path = '/' + path;
        }

        torrents.push({
            type: torrentTypeParser.getType(rowDatas.eq(0).find('img').attr('src')),
            name: rowDatas.eq(1).find('a > b').text(),
            url: 'http://' + that.ZAMUNDA_URL + path,
            rating: rating,
            size: size,
            /* While not logged in - seeds td is not presented in the response from zamunda */
            seeds: seeds
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

Parser.prototype.getPagination = function(pagesElement) {
    var lastAnchor = pagesElement.find('a').last();
    // If last page is requested in zamunda.net
    // Last page is in <b> tag instead of <a> (for all selected pages not only the last).
    // If last page isn't selected probably lastAnchor variable is the last child.
    var isLastPageSelected = ! lastAnchor.is(':last-child');

    var pagePath = lastAnchor.attr('href'); // This is last <a> href attr.
    var pagesCount;
    var maxTorrents;
    if (isLastPageSelected) { // Then the last page is <b> without "href" attr.
        pagesCount = pagePath ? pagePath.split('=').pop() : 0;
        pagesCount++; // increasing cuz pagesPath is last but one page.
        maxTorrents = pagesElement.find('b').last().text().split('-').pop();
    } else {
        pagesCount = pagePath ? pagePath.split('=').pop() : 0; // Parsed to int in return object.
        maxTorrents = lastAnchor.find('b').text().split('-').pop();
    }
    maxTorrents = maxTorrents ? parseInt(maxTorrents, 10) : undefined;
    
    return {
        pagesCount: pagesCount | 0,
        torrentsCount: maxTorrents
    };
};

module.exports = Parser;