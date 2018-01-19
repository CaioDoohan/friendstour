var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var Anuncio    = require("../models/anunciosDAO.js");

router.get('/', function(req, res, next) {
    
    var AnuncioModel = new Anuncio();

    AnuncioModel.getAllAnuncio(function(erro, result){

        for(var i=0 ; i < result.length; i++){

            result[i].nome_prod;
            result[i].datacriacao_prod = moment(result[i].datacriacao_prod).format('DD/MM/YYYY');
            result[i].vagas_prod;
            result[i].ativo_prod;
            // console.log('Anuncio:',result[i]);
        }
        res.render('admin/anuncios', { title: 'Anúncio', produto : result });
    });
});

router.get('/adicionar', function(req,res,next){
    
    var AnuncioModel = new Anuncio(null)
    
    AnuncioModel.getCategoria(function(erro,resultado){
        console.log(resultado);
        AnuncioModel.getInclusos(function(erro,tipos){
            res.render('admin/adicionar', { title : 'Adicionar', categoria : resultado, inclusos : tipos, produto : {} });
        });
    });
});

router.post('/adicionar/dados_enviados', function(req,res,next){
    
    var AnuncioModel = new Anuncio(null);
    
    var dados = req.body;

    AnuncioModel.addAnuncio(dados, function(erro, result){
        res.render('admin/adicionar', { title: 'Friendstour - Registrado', categoria : {}, inclusos : {}});
    });
});


module.exports = router;