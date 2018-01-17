var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var Anuncio    = require("../models/anunciosDAO.js");

router.get('/', function(req, res, next) {
    
    var AnuncioModel = new Anuncio(null)
    
        AnuncioModel.getCategoria(function(erro,resultado){
           console.log(resultado);
            AnuncioModel.getTipo(function(erro,tipos){
                console.log(tipos);
                res.render('admin/action', { title : 'Friendstour - Action', categoria : resultado, tipagem : tipos, dados : {}});
            });
        });
});

router.post('/salvar_teste', function(req,res,next){

    var AnuncioModel = new Anuncio(null);
    
    var dados = req.body;
    

    AnuncioModel.addAnuncio(dados, function(erro, result){
        // console.log(dados);
        res.render('admin/action', { title: 'Friendstour - Registrado', categoria : {}, tipagem : {}});
    });
});

module.exports = router;