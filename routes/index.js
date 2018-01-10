var express = require('express');
var router = express.Router();
var db = require('../db');
var anuncioModels = require('../models/anuncioModel');

/* GET home page. */
router.get('/', function(req, res, next) {

  var con = db();
  var anuncioModel = new anuncioModels();

  anuncioModel.getAnuncio(con, function(erro, result){
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

/* GET users listing. */
router.post('/views/contato/salvar', function(req, res, next) {
  var dadosFormulario = req.body;

  var con = new db();
  var anuncioModel = new anuncioModels();

  console.log('x',dadosFormulario);
  anuncioModel.salvarNoticia(dadosFormulario, con, function(erro, result){
    console.log('entrou 1');

    res.render('contato', { title: 'Friendstour - Contato',msg:1 });
  });
});


router.get('/detalhes', function(req, res, next) {
  res.render('detalhes', { title: 'Friendstour - Detalhes' });
});

module.exports = router;  
