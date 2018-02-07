var express = require('express');
var router = express.Router();

router.use('/', require('../controllers/login'));

router.use('/anuncios', require('../controllers/anuncios'));

router.use('/imagens', require('../controllers/imagens'));

router.use('/account', require('../controllers/account'));

module.exports = router;
