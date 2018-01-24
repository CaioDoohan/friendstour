var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
var Event    = require("../models/indexDAO.js");

router.get('/', function(req, res, next) {
    
    var EventModel = new Event();

    EventModel.getAnuncios(function(erro,produtos){
        // console.log(produtos[4]);
        for(var i=0 ; i < produtos.length; i++){

            produtos[i].id_prod;
            produtos[i].nome_prod;
            produtos[i].desc_prod;
            produtos[i].horario = moment(produtos[i].data_prod).format('HH:mm');
            produtos[i].data = moment(produtos[i].data_prod).format('DD/MM/YYYY');
            produtos[i].valor_prod;
            produtos[i].parcelas_prod;
            produtos[i].texto_prod;
            produtos[i].ativo_prod;
            produtos[i].vagas_prod;
            produtos[i].categoria;
            produtos[i].inclusos;
            
        }
        
        res.render('index', { title: 'Friendstour - Home', produto : produtos});    
    });
});

module.exports = router;
