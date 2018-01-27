var express = require('express');
var router = express.Router();


router.get('/', function(req,res,next){
    res.render('admin/principal', { title: 'Friendstour - Admin' });
});

router.use('/anuncios', require('../controllers/anuncios'));

router.use('/imagens', require('../controllers/imagens'));

module.exports = router;
