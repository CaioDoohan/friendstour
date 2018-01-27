var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
var Anuncio  = require("../models/anunciosDAO.js");

router.get('/', function(req, res, next) {
    
    var AnuncioModel = new Anuncio();

    AnuncioModel.getAllAnuncio(function(erro, result){

        for(var i=0 ; i < result.length; i++){

            result[i].nome_prod;
            result[i].datacriacao_prod = moment(result[i].datacriacao_prod).format('DD/MM/YYYY');
            result[i].vagas_prod;
            result[i].ativo_prod;
        }
        res.render('admin/anuncios', { title: 'Friendstour - Anúncio', produto : result, remove : false });
    });

});

router.get('/adicionar', function(req,res,next){
    
    var AnuncioModel = new Anuncio(null)
    
    AnuncioModel.getCategoria(function(erro,resultado){
        
        AnuncioModel.getInclusos(function(erro,tipos){
            res.render('admin/adicionar', { title : 'Friendstour - Adicionar', categoria : resultado, inclusos : tipos, produto : {}, add : false });
        });
    });
});

router.post('/adicionar/dados_enviados', function(req,res,next){
    
    var AnuncioModel = new Anuncio(null);
    
    var dados = req.body;

    var dadosForm = {
        nome_prod     : dados.nome_prod,
        categoria     : dados.categoria,
        desc_prod     : dados.desc_prod,
        data_prod     : (dados.dia_prod + ' ' + dados.hora_prod),
        valor_prod    : dados.valor_prod,
        nacional_prod : dados.nacional_prod,
        incluso       : dados.incluso,
        parcelas_prod : dados.parcelas_prod,
        vagas_prod    : dados.vagas_prod,
        texto_prod    : dados.texto_prod,
    }

    AnuncioModel.addAnuncio(dadosForm, function(erro, confirm){
        var confirmacao = true;
        AnuncioModel.getCategoria(function(erro,resultado){
            
            AnuncioModel.getInclusos(function(erro,tipos){
                // console.log(confirm);
                res.render('admin/adicionar', { title : 'Friendstour - Adicionar', categoria : resultado, inclusos : tipos, produto : {}, add : confirmacao });
            });
        });
        
    });
});

router.get("/editar/produto-:id",function(req,res,next){

    var id = req.params.id;
    var AnuncioModel = new Anuncio();

    AnuncioModel.getFullAnuncio(id, function(erro,resultado){
        // console.log(resultado);

        produtoEdit = {
            id_prod: resultado.id_prod,
            nome_prod : resultado.nome_prod,
            desc_prod : resultado.desc_prod,
            dia_prod : moment(resultado.data_prod).format('YYYY/MM/DD'),
            hora_prod : moment(resultado.data_prod).format('HH:mm:ss'),
            valor_prod : resultado.valor_prod,
            parcelas_prod : resultado.parcelas_prod,
            texto_prod : resultado.texto_prod,
            nacional_prod : resultado.nacional_prod,
            ativo_prod : resultado.ativo_prod,
            vagas_prod : resultado.vagas_prod,
            categoria : resultado.categoria,
            inclusos : resultado.inclusos,
            criacao : resultado.criacao,
        }

        AnuncioModel.getCategoria(function(erro,categorias){
            
            AnuncioModel.getInclusos(function(erro,incluso){
                // console.log(chalk.blue(produtoEdit.nacional_prod));
                res.render('admin/edit', { title : 'Friendstour - Editar', categoria : categorias, inclusos : incluso, produto : produtoEdit, edit : false  });
            });

        });

    });
    

});

router.post("/editar/dados_alterados", function(req,res,next){

    var dadosAlter = req.body;

    var dadosEdit = {

        id_prod       : dadosAlter.id_prod,
        nome_prod     : dadosAlter.nome_prod,
        categoria     : dadosAlter.categoria,
        desc_prod     : dadosAlter.desc_prod,
        data_prod     : (dadosAlter.dia_prod + ' ' + dadosAlter.hora_prod),
        valor_prod    : dadosAlter.valor_prod,
        nacional_prod : dadosAlter.nacional_prod,
        incluso       : dadosAlter.incluso,
        parcelas_prod : dadosAlter.parcelas_prod,
        vagas_prod    : dadosAlter.vagas_prod,
        texto_prod    : dadosAlter.texto_prod

    }

    var AnuncioModel = new Anuncio();

    AnuncioModel.editAnuncio(dadosEdit, function(erro, resultado){
        confirmacao = true;
        AnuncioModel.getCategoria(function(erro,categorias){
            
            AnuncioModel.getInclusos(function(erro,incluso){
                res.render("admin/edit", {title : 'Friendstour - Anúncios',categoria : categorias , inclusos : incluso, produto : resultado, edit : confirmacao });
            });
    
        });
        
    });

});

router.get('/remover/produto-:id', function(req,res,next){

    var id = req.params.id;
    
    var AnuncioModel = new Anuncio();

    AnuncioModel.removeAnuncio(id, function(erro, callback){

        var confirmacao = true;

        AnuncioModel.getAllAnuncio(function(erro, result){
            
            for(var i=0 ; i < result.length; i++){
    
                result[i].nome_prod;
                result[i].datacriacao_prod = moment(result[i].datacriacao_prod).format('DD/MM/YYYY');
                result[i].vagas_prod;
                result[i].ativo_prod;
            }

            res.render('admin/anuncios', { title: 'Friendstour - Anúncio', produto : result, remove : confirmacao});
        });
        
    });
});


module.exports = router;