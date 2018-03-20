var express = require('express');
var router = express.Router();

/*CONTROLE DAS ROTAS->CONTROLLERS->MODELS->DB */
router.use("/", require('../controllers/index'));
router.use("/contato", require('../controllers/contato'));
router.use("/detalhes", require('../controllers/detalhes'));

/* GET empresa. */
router.get('/empresa', function(req, res, next) {
  res.render('empresa', { title: 'Friendstour - Empresa' });
});

router.get('/empresa', function(req, res, next) {
  res.render('empresa', { title: 'Friendstour - Empresa' });
});

router.use("/lista", require('../controllers/lista'));

module.exports = router;  
