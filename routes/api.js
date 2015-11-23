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
            res.end();
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
    torrentService.getRecommended().then(function(data) {
        console.log(data);
        res.end(JSON.stringify(data));
    }/*Error handling TODO*/);
});

router.post('/torrent/search', function(req, res) {
    function sendResponse(torrentList) {
        res.send(torrentList);
        res.end();
    }
    function sendError(err) {
        res.status = err.status || 500;
        res.json(err || 'Server hitted unknown error.');
        res.end();
    }
    // TODO Remove cl
    console.log('req', req);
    torrentService.search(req.body).then(sendResponse, sendError);
});

module.exports = router;