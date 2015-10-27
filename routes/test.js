var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res){
    var testPath = path.join(__dirname, '../public', 'test.html');
    res.sendFile(testPath);
});

module.exports = router;