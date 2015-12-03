/**
 * Important!
 * 
 * This route is never accessed is the server uses public folder
 * which contains index.html file.
 */

var express = require('express');
var router = express.Router();
var rootPath = require('app-root-path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(rootPath + '/public/index.html');
});

module.exports = router;