var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
var Anuncio  = require("../models/anunciosDAO.js");
const multer = require('multer');
var validator = require('express-validator');
//var Imagem = require('../models/imagensDAO');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/uploads/prods/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'-'+ file.originalname);
    }
});

var upload = multer({storage : storage});

var cpUpload = upload.fields([{ name: 'imghome', maxCount: 1 }, { name: 'imgdet', maxCount: 4 }]);

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
        console.log("CATEGORIA:", resultado);
        AnuncioModel.getInclusos(function(erro,tipos){
            console.log("INCLUSOS:", tipos);
            res.render('admin/adicionar', { title : 'Friendstour - Adicionar', categoria : resultado, inclusos : tipos, produto : {}, add : null });
        });
    });
});

router.post('/validate', function(req,res){
    if(req.body.event != ""){
        var event = req.body.event;
    }else{
        return 0;
    }
    var msg;
    var type;
    var AnuncioModel = new Anuncio();
    AnuncioModel.verifyEvent(event, function(err, callback){
        if(callback == false){
            msg = "Evento já existente";
            type = false;
            console.log(chalk.blue(msg));
            return res.json( {msg : msg, type : type} );
            // return msg;
        }else if(callback == true){
            msg = "Evento disponível";
            type = true;
            return res.json({msg : msg, type : type});
        }else{
            console.log(chalk.blue(err));
            return res.json({msg : {} , type : undefined});
        }
    });
})

router.post('/adicionar/dados_enviados', function(req,res,next){
    
    var AnuncioModel = new Anuncio(null);

    var detImg = new Array();   
    
    cpUpload(req,res,function(err) {
    
        req.checkBody('nome_prod').exists().notEmpty().isLength({ min : 3 }).exists();
        req.checkBody('desc_prod','Descricao muito grande').exists().notEmpty().isLength({ max : 143 });
        req.checkBody('texto_prod').exists().notEmpty();

        var erros = req.validationErrors();

        if(erros){   
            console.log(chalk.red(erros));     
            confirmacao = erros;
            console.log(chalk.red(confirmacao));
            AnuncioModel.getCategoria(function(erro,resultado){
                AnuncioModel.getInclusos(function(erro,tipos){
                    // console.log(confirm);
                    res.render('admin/adicionar', { title : 'Friendstour - Adicionar', categoria : resultado, inclusos : tipos, produto : {}, add : confirmacao });
                });
            });
        }else{
            var dados = req.body;
            console.log(req.body);
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
                promo_prod    : dados.promo_prod
            }
    
            if(req.files.imghome){
                if( req.files.imghome != undefined ){
                    //console.log("nao é undefined", req.files.imghome);
                    var imgHome = {
                        home : req.files.imghome[0].filename
                    }
                }else{
                    //console.log("é undefined", req.files.imghome);
                    var imgHome = undefined
                }
            }
            
            if(req.files.imgdet){
                //console.log(req.files.imgdet[0].filename);
                if(  req.files.imgdet != undefined ){
                    //console.log("ENTROU DIFERENTE", req.files.imgdet.length);
                    var detImg = [];
                    for(var i = 0; i < req.files.imgdet.length; i++){
                        //console.log("ENTROU DIFERENTE", req.files.imgdet[i].filename);
                        detImg.push(req.files.imgdet[i].filename);
                    }
                }else{
                    //console.log("é undefined",  req.files.imgdet);
                    var detImg = undefined;
                }
            }
            
            //console.log('DADOS FORM:',dadosForm);
            //console.log('IMGS:', imgHome);
            //console.log('IMGS:', detImg);

            
            AnuncioModel.addAnuncio(dadosForm,imgHome, detImg, function(erro, confirm){
                //console.log("CONFIRMACAO:", confirmacao);
                //console.log("ESSA É CONFIRMACAO",confirm);
                //console.log("ESSA É ERRO",erro);
                if(confirmacao == null || confirmacao == undefined){
                    if( confirm == 0 ){
                        var confirmacao = erro;
                    }else{
                        var confirmacao = 1;
                    }
                }
                AnuncioModel.getCategoria(function(erro,resultado){
                    AnuncioModel.getInclusos(function(erro,tipos){
                        res.render('admin/adicionar', { title : 'Friendstour - Adicionar', categoria : resultado, inclusos : tipos, produto : {}, add : confirmacao });
                    });
                });
            });
        }
        
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
            promo_prod : resultado.promo_prod,
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

router.post("/editar/dados_enviados", function(req,res,next){

    var dadosAlter = req.body;
    var dadosEdit = {
        id_prod       : dadosAlter.id_prod,
        nome_prod     : dadosAlter.nome_prod,
        categoria     : dadosAlter.categoria,
        desc_prod     : dadosAlter.desc_prod,
        data_prod     : (dadosAlter.dia_prod + ' ' + dadosAlter.hora_prod),
        valor_prod    : dadosAlter.valor_prod,
        nacional_prod : dadosAlter.nacional_prod,
        promo_prod    : dadosAlter.promo_prod,
        incluso       : dadosAlter.incluso,
        parcelas_prod : dadosAlter.parcelas_prod,
        vagas_prod    : dadosAlter.vagas_prod,
        texto_prod    : dadosAlter.texto_prod

    }
    var AnuncioModel = new Anuncio();
    
    AnuncioModel.editAnuncio(dadosEdit, function(erro, resultado){
        if(resultado != 1){
            var msgError;
            switch(erro.sqlMessage) {
                case 'Data too long for column \'desc_prod\' at row 1':
                    msgError = ("ERRO: Campo 'Pequena Descrição' muito longo");
                    break;

                case 'Data too long for column \'text_prod\' at row 1':
                    msgError = ("ERRO: Campo 'Detalhes' muito longo");
                    break;
                default:
                    msgError = ("ERRO: repita a operação - '" + erro + "' ");
            }
            res.json({ 
                msg : msgError
             })
        }else{
            res.json({
                msg : "Produto alterado"
            })
        }
    });
});

router.post('/remover', function(req,res,next){

    var id = req.body.id;
    var AnuncioModel = new Anuncio();
    AnuncioModel.removeAnuncio(id, function(erro, callback){
        if( erro == 1 || callback == undefined){
            res.json({ 
                msg : "ERRO: repita a operação"
             })
        }else{
            res.json({
                msg : "Produto removido"
            })
        }
    });
});

router.post('/desativar', function(req,res){
    var id = req.body.id;
    var status = req.body.turn;

    var AnuncioModel = new Anuncio();

    AnuncioModel.desativarAnuncio(id,status, function(erro, result){
        if( erro == 1 || result == undefined){
            res.json({ 
                msg : "ERRO: repita a operação"
             })
        }else{
            res.json({
                msg : "Status alterado"
            })
        }

    });

});

module.exports = router;