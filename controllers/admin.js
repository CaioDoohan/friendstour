var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var Anuncios    = require("../models/adminDAO.js");

router.get('/', function(req, res, next) {
    
    var AnunciosModel = new Anuncios();

    AnunciosModel.getAnuncio(function(erro, result){
        
        for(var i=0; i < result.length; i++){
            result[i].nome;
            result[i].valor;
            result[i].partida;
            result[i].destino;
            result[i].hora = moment(result[i].saida).format('LT');
            result[i].dia = moment(result[i].saida).format('l');
            result[i].formpag;
            result[i].percurso;
        }

        res.render('index', { 
            title: 'Friendstour - Admin',
            description: 'Éssa é a descrição da página Home',
            teste : result
        });
    });
});



module.exports = router;