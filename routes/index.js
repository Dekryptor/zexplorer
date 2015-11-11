/**
 * Important!
 * 
 * This route is never accessed is the server uses public folder
 * which contains index.html file.
 */

var express = require('express');
var router = express.Router();

var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	var indexPath = path.join(__dirname, '../public', 'index.html');
    res.sendFile(indexPath);
});

module.exports = router;