var express = require('express');
var router = express.Router();

/*CONTROLE DAS ROTAS->CONTROLLERS->MODELS->DB */
router.use("/", require('../controllers/index'));
router.use("/contato", require('../controllers/contato'));

/* GET empresa. */
router.get('/empresa', function(req, res, next) {
  res.render('empresa', { title: 'Friendstour - Empresa' });
});

/* GET lista. */
router.get('/lista', function(req, res, next) {
  res.render('lista', { title: 'Friendstour - Lista' });
});

/* GET detalhes. */
router.get('/detalhes', function(req, res, next) {
  res.render('detalhes', { title: 'Friendstour - Detalhes' });
});

module.exports = router;  
