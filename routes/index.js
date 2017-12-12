var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Friendstour - Home' });
});

/* GET empresa. */
router.get('/empresa', function(req, res, next) {
  res.render('empresa', { title: 'Friendstour - Empresa' });
});

/* GET lista. */
router.get('/lista', function(req, res, next) {
  res.render('lista', { title: 'Friendstour - Lista' });
});


module.exports = router;
