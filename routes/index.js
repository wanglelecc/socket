var express = require('express');
var uuid = require('uuid');
var sha1 = require('sha1');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/b2w', function(req, res, next){
  var accessToken = sha1(uuid.v4());
  res.render('b2w', { title: 'B2W', accessToken: accessToken });
});

router.get('/display', function(req, res, next){
  var accessToken = sha1(uuid.v4());
  res.render('display', { title: 'Display', accessToken: accessToken  });
});

module.exports = router;
