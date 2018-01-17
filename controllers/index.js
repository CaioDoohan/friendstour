var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var Event    = require("../models/indexDAO.js");

router.get('/', function(req, res, next) {
    
    var EventModel = new Event();

    EventModel.getAnuncio(function(erro, result){
        
        for(var i=0 ; i < result.length; i++){
            result[i].nome;
            result[i].cidade;
            result[i].destino;
            result[i].horario;
            result[i].data;
            result[i].saida;
            result[i].valor;
            result[i].formpag;
            
            // dados.id_categoria,
            // dados.id_tipagem,
            // dados.nome,
            // dados.cidade,
            // dados.destino,
            // dados.horario,
            // dados.data,
            // dados.saida,
            // dados.valor,
            // dados.formpag 
        }

        res.render('index', { title: 'Friendstour - Home', teste : result});
    });
});

module.exports = router;