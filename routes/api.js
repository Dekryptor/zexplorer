/*
| All api routes are defined in this file.
*/
var express = require('express');
var router = express.Router();
var path = require("path");
var log = require('../modules/simple-logger');

/*
|------------------------------
| Authentication
|------------------------------
*/
var auth = require(path.normalize(__dirname + '/../modules/zamunda/auth'));

router.post('/auth/login', function(req, res){
    auth.login(req.body).then(function(cookies) {
        res.json(cookies);
        res.end();
    }, errorHandler);

    function errorHandler(err) {
        if (err.messageBG) {
            res.status(err.status || 500);
            res.end(err.messageBG);
        }
        else {
            res.status(500);
            res.end('Server hitted an unknown error while processing your request.');
        }
    }
});



/*
|------------------------------
| Torrent
|------------------------------
*/
var torrentService = require(path.normalize(path.dirname() + '/../modules/zamunda/torrentService'));

router.post('/torrent/recommended', function(req, res) {
    torrentService.getRecommended(req.headers.cookie).then(function(data) {
        res.end(JSON.stringify(data));
    }/*Error handling TODO*/);
});

router.post('/torrent/search', function(req, res) {
    function sendResponse(torrentList) {
        res.send(torrentList);
        res.end();
    }
    function sendError(err) {
        res.status(err.status || 500);
        res.json(err || {err: 'Server hitted an unknown error.'});
        res.end();
    }
    torrentService.search(req.body, req.headers.cookie).then(sendResponse, sendError);
});

router.get('/torrent/description', function(req, res) {
    torrentService.getTorrentDescriptionHTML(req.query.url).then(function(html){
        res.end(html);
    });
});

module.exports = router;
