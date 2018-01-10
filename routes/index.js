var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  var con = db();
  con.query('select * from teste', function(erro, result){
    res.render('index', { title: 'Friendstour - Home', teste : result });
  });
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
