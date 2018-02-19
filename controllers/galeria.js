var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
var Galeria  = require("../models/galeriaDAO.js");

router.get('/', function(req, res, next) {
    var GaleriaModel = new Galeria();
    
    res.render('admin/galeria', { title: 'Friendstour - Galeria de Imagens', images : undefined });

});

router.post('/get', function(req,res){

    var field = req.body.field;
    var type = req.body.type;
    //console.log(field);
    //console.log(type);
    var GaleriaModel = new Galeria();

    GaleriaModel.getIds(field, type, function(erro, result){
        console.log(erro);
        console.log(result);
        var ids = new Array();
        if(erro){
            res.json({
                msg : erro
            });
        }else if( result[0] == undefined ){
            res.json({
                msg : "Sem registro de anúncios"
            })
        }else{
            for(var i=0; i < result.length; i++){
                ids.push(result[i].id_prod);
            }
            console.log(ids);
            res.json({
                ids : ids
            })
        }
    });

})

module.exports = router;
