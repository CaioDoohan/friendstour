var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
var Galeria  = require("../models/galeriaDAO.js");

router.get('/', function(req, res, next) {   
    res.render('admin/galeria', { title: 'Friendstour - Galeria de Imagens', images : undefined });
});

router.post('/get', function(req,res){

    var field = req.body.field;
    var type = req.body.type;

    var GaleriaModel = new Galeria();

    GaleriaModel.getIds(field, type, function(erro, result){
        var ids = new Array();
        if(erro){
            res.json({
                msg : erro
            });
        }else if( result[0] == undefined ){
            res.json({
                msg : "Sem registro de anúncios"
            });
        }else{
            for(var i=0; i < result.length; i++){
                ids.push(result[i].id_prod);
            }
            //console.log(ids);
            res.json({
                ids : ids
            })
        }
    });

});

router.post('/post', function(req,res){

    var idImagem = req.body.idProd;

    var GaleriaModel = new Galeria();

    //console.log("CONTROL",id);
    
    GaleriaModel.getImages(idImagem, function(erro,result){
        // console.log("CONTROL",result);
        if( erro == 1){
            // console.log(chalk.yellow("ERRO"));
            res.json({
                msg : "Erro"
            })
        }else{
            //console.log("CONTROL:",result);
            res.json(result);
        }
    });
});

router.post('/remover', function(req,res,next){

    var id = req.body.camp1;
    var type = (req.body.camp2 == 0 ? 'det' : 'home');
    
    var GaleriaModel = new Galeria();

    GaleriaModel.remover(id,type, function(erro, callback){
        if( erro == 1 || callback == undefined){
            res.json({ 
                msg : "ERRO: repita a operação"
             })
        }else{
            res.json({
                msg : "Imagem removida"
            })
        }
    });
});

router.post('/desativar', function(req,res){
    var id = req.body.id;
    var status = req.body.turn;
    var type = (req.body.type == 0 ? 'det' : 'home');

    var GaleriaModel = new Galeria();

    GaleriaModel.desativar(id,status,type, function(erro, result){
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
