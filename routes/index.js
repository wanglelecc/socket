var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/b2w', function(req, res, next){
  res.render('b2w', { title: 'B2W' });
});

router.get('/display', function(req, res, next){
  res.render('display', { title: 'Display' });
});

module.exports = router;
