var express = require('express');
var router = express.Router();

router.use("/", require('../controllers/index'));
router.use("/contato", require('../controllers/contato'));
router.use("/detalhes", require('../controllers/detalhes'));

/* GET empresa. */
router.get('/empresa', function(req, res, next) {
  if( req.query.fd != undefined){
    res.render('empresa', { title: 'Friendstour - Empresa' , ft : true });
  }else{
    res.render('empresa', { title: 'Friendstour - Empresa' , ft : false });
  }
});

router.use("/lista", require('../controllers/lista'));

module.exports = router;  
