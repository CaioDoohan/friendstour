var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
var Event    = require("../models/indexDAO.js");

router.get('/', function(req, res, next) {
    
    var EventModel = new Event();    

    EventModel.getAnuncios(function(erro,produtos){
        //console.log("PRODS:",produtos);
        if( produtos != undefined ){
            for(var i=0 ; i < produtos.length; i++){
                produtos[i].id_prod;
                produtos[i].nome_prod;
                produtos[i].desc_prod;
                produtos[i].horario = moment(produtos[i].data_prod).format('HH:mm');
                produtos[i].data = moment(produtos[i].data_prod).format('DD/MM/YYYY');
                produtos[i].valor_prod;
                produtos[i].parcelas_prod;
                produtos[i].vagas_prod;
                produtos[i].categoria;
                produtos[i].inclusos;
                produtos[i].imagem;
            }
        }
        EventModel.getBanners(function(result){
            var banners = new Array();
            //console.log(result);
            if(result[0] != undefined){
                for(var i = 0 ; i < result.length; i ++){
                    banners.push(result[i].banner);
                }
            }else{
                banners = undefined;
            }
            res.render('index', { title: 'Friendstour - Home', produto : produtos, banner : banners});   
        });
    });
});

module.exports = router;
