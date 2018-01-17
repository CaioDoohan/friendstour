var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
// var Event    = require("../models/indexDAO.js");

router.get('/', function(req, res, next) {
    res.render('/admin/principal', { title: 'Friendstour - Admin'});
});

// router.get('/', function(req, res, next) {
    
//     var EventModel = new Event();

//     EventModel.getAnuncio(function(erro, result){
        
//         for(var i=0; i < result.length; i++){
//             result[i].nome;
//             result[i].valor;
//             result[i].partida;
//             result[i].destino;
//             result[i].hora = moment(result[i].saida).format('LT');
//             result[i].dia = moment(result[i].saida).format('l');
//             result[i].formpag;
//             result[i].percurso;
//             console.log(result);
//         }

//         res.render('index', { 
//             title: 'Friendstour - Home',
//             description: 'Éssa é a descrição da página Home',
//             teste : result
//         });
//     });
// });

module.exports = router;