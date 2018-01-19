var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var Event    = require("../models/indexDAO.js");

router.get('/', function(req, res, next) {
    
    var EventModel = new Event();

    //var localTime  = moment.utc(divUtc.text()).toDate();
    //localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
    //console.log(localTime); 

    EventModel.getAnuncio(function(erro, result){
        
        for(var i=0 ; i < result.length; i++){
            result[i].id_prod;
            result[i].nome_prod;
            result[i].desc_prod;
            result[i].horario = moment(result[i].data_prod).format('HH:mm');
            result[i].data = moment(result[i].data_prod).format('DD/MM/YYYY');
            result[i].valor_prod;
            result[i].parcelas_prod;
            result[i].vagas_prod;
            console.log('VampetaDate:',result[i]);
        }
        // console.log(result);
        res.render('index', { title: 'Friendstour - Home', produto : result});
    });
});

module.exports = router;