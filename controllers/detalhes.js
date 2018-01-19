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

        var teste = result.length > 0 ? result[0] : undefined;
        var param;

        if(teste != undefined){

            param = {
                id_prod : teste.id_prod,
                nome_prod : teste.nome_prod,
                desc_prod : teste.desc_prod,
                horario : teste.horario = moment(teste.data_prod).format('HH:mm'),
                data : teste.data = moment(teste.data_prod).format('DD/MM'),
                valor_prod : teste.valor_prod,
                parcelas_prod : teste.parcelas_prod,
                texto_prod : teste.texto_prod,
                
            }
        }
        console.log('RESULT QUERY:', param);     
        res.render('detalhes', { title: 'Friendstour - Detalhes', produto : param});
    });
});

module.exports = router;