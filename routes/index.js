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

router.get('/contato', function(req, res, next) {
  res.render('contato', { title: 'Friendstour - Contato' });
});

router.get('/detalhes', function(req, res, next) {
  res.render('detalhes', { title: 'Friendstour - Detalhes' });
});

module.exports = router;  
