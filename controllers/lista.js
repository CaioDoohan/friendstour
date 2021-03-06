var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
var Event    = require("../models/indexDAO.js");

router.get("/:format", function(req,res){
    var format = req.params.format;
    var statment;
    var title;

    switch(format) {
        case 'nacional':
          var thatX = {
            statment : "WHERE ativo_prod = b'1' and nacional_prod = b'0' order by datacriacao_prod desc LIMIT 10 ",
          }
          var title = 'Nacional';
          var banner ="/images/nacional.png";
            break;
        case 'internacional':
            var thatX = {
                statment : "WHERE ativo_prod = b'1' and nacional_prod = b'1' order by datacriacao_prod desc LIMIT 10",
            }
            var title = 'Internacional';
            var banner ="/images/internacional.png";
            break;
        case 'cruzeiros':
            var thatX = {
                statmentCat : "and nome_cat LIKE '%Cruzeiro%'" ,
            }
            var title = 'Cruzeiros';
            var banner = "/images/cruzeiros.png";
            break;
        case 'excursoes':
            var thatX = {
                statmentCat : "and nome_cat LIKE '%Excursão%'",
            }
            var title = 'Excursões';
            var banner ="/images/excursoes.png";
            break;

        case 'pacotes':
            var title = 'Pacotes';
            var banner ="/images/pacotes.png";
        break;
    }

    var EventModel =  new Event();

    EventModel.getAnuncios(thatX, function(erro,produtos){
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

        
        if( format == "cruzeiros"){
            res.render('listseg', { title: ("Friendstour - " + title), produto : produtos, banner : banner, type : title});   
        }else if(format == "pacotes"){
            // console.log(produtos);
            res.render('listpack', { title: ("Friendstour - " + title), produto : produtos, banner : banner, type : title});
        }else{
            res.render('lista', { title: ("Friendstour - " + title), produto : produtos, banner : banner, type : title});   
        }
    });
})

module.exports = router;