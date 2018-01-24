var express      = require('express')
var router       = express.Router();
var moment       = require('moment');
var DetalhesDAO  = require('../models/DetalhesDAO.js');

router.get('/:id', function(req, res, next) {
    // console.log("-----------------Entrou--------------")
    var id = req.params.id;
    console.log('ID:', id);
    var Detalhes = new DetalhesDAO(null);

    Detalhes.getId( id , function(erro, result){

        var prod = result.length > 0 ? result[0] : undefined;
        var param;

        if(prod != undefined){

            param = {
                id_prod : prod.id_prod,
                nome_prod : prod.nome_prod,
                desc_prod : prod.desc_prod,
                horario : prod.horario = moment(prod.data_prod).format('HH:mm'),
                data : prod.data = moment(prod.data_prod).format('DD/MM'),
                valor_prod : prod.valor_prod,
                parcelas_prod : prod.parcelas_prod,
                texto_prod : prod.texto_prod,
                
            }
        }
        // console.log('RESULT QUERY:', param);     
        res.render('detalhes', { title: 'Friendstour - Detalhes', produto : param});
    });
});



module.exports = router;