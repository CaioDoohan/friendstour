var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var Anuncio    = require("../models/anunciosDAO.js");

router.get('/', function(req, res, next) {
    
    var AnuncioModel = new Anuncio();

    AnuncioModel.getAllAnuncio(function(erro, result){
        res.render('admin/anuncios', { title: 'Anúncio', categoria : result });
    });
});

module.exports = router;