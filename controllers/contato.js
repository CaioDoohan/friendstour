var express      = require('express')
var router       = express.Router();
var ContatoDAO    = require('../models/ContatoDAO.js');

router.get('/', function(req, res, next) {
    res.render('contato', { title: 'Friendstour - Contato'});
});

router.post('/formulario_enviado', function(req, res, next) {

    var dadosFormulario = req.body;
    
    var cadastrarModel = new ContatoDAO(null);

    cadastrarModel.salvarAnuncio(dadosFormulario,function(erro, resultado){
        res.render('contato', { title: 'Friendstour - Contato'});
    });

});

module.exports = router;