var express      = require('express')
var router       = express.Router();

router.get('/', function(req, res, next) {
    res.render('contato', { title: 'Friendstour - Contato'});
});

router.post('/formulario_enviado', function(req, res, next) {
    console.log("OK");

});

module.exports = router;