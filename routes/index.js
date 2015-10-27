var express = require('express');
var router = express.Router();

var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	var indexPath = path.join(__dirname, '../public', 'index.html');
    res.sendFile(indexPath);
});

module.exports = router;