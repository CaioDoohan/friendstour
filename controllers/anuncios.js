var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk = require('chalk');
var Anuncio    = require("../models/anunciosDAO.js");

router.get('/', function(req, res, next) {
    
    var AnuncioModel = new Anuncio();

    AnuncioModel.getAllAnuncio(function(erro, result){

        for(var i=0 ; i < result.length; i++){

            result[i].nome_prod;
            result[i].datacriacao_prod = moment(result[i].datacriacao_prod).format('DD/MM/YYYY');
            result[i].vagas_prod;
            result[i].ativo_prod;
        }
        res.render('admin/anuncios', { title: 'Anúncio', produto : result });
    });
});

router.get('/adicionar', function(req,res,next){
    
    var AnuncioModel = new Anuncio(null)
    
    AnuncioModel.getCategoria(function(erro,resultado){
        
        AnuncioModel.getInclusos(function(erro,tipos){
            res.render('admin/adicionar', { title : 'Friendstour - Adicionar', categoria : resultado, inclusos : tipos, produto : {} });
        });
    });
});

router.post('/adicionar/dados_enviados', function(req,res,next){
    
    var AnuncioModel = new Anuncio(null);
    
    var dados = req.body;

    // console.log(dados);

    AnuncioModel.addAnuncio(dados, function(erro, result){
        res.render('admin/adicionar', { title: 'Friendstour - Registrado', categoria : {}, inclusos :{} , produto: {}});
    });
});

router.get("/editar/produto-:id",function(req,res,next){

    var id = req.params.id;

    var AnuncioModel = new Anuncio();

    AnuncioModel.getFullAnuncio(id, function(erro,resultado){
        
        AnuncioModel.getCategoria(function(erro,categorias){
            
            AnuncioModel.getInclusos(function(erro,incluso){
                // console.log(chalk.blue('categoria',categorias[0].id_cat));
                res.render('admin/edit', { title : 'Friendstour - Editar', categoria : categorias, inclusos : incluso, produto : resultado });
            });

        });

    });
    

});

router.post("/editar/dados_alterados", function(req,res,next){

    var dadosAlter = req.body;

    // console.log(dadosAlter);

    var AnuncioModel = new Anuncio();

    AnuncioModel.editAnuncio(dadosAlter, function(erro, resultado){
        res.render("admin/edit", {categoria : {}, inclusos : {}, produto : {} });
    })

})


module.exports = router;