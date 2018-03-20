var express          = require('express')
var router           = express.Router();
var moment           = require('moment');
var chalk            = require('chalk');
var jwt              = require('jwt-simple');
var passport         = require('passport');
var JwtBearerStrategy = require('passport-http-bearer'); 
var validator         = require('express-validator');
var configJwt         = require('../config/config');
var User              = require("../models/loginDAO.js");

router.get('/', function(req, res,next){
    // console.log(req.headers.authorization);
    res.render('admin/login', { title: 'Friendstour - Login', erros : {} });
});

router.get('/verify',passport.authenticate('bearer', { session: false }),  function(req, res) {
    // console.log('autenticado');

    res.write('1');
    res.end();
});

router.post("/login",function(req, res) {
    req.checkBody('username', 'Nome de usuário é obrigatório').notEmpty();
    req.checkBody('password', 'Senha é obrigatório').notEmpty();
    var erros = req.validationErrors();
    try{
        var dadosLog = {
            username : req.body.username,
            password : req.body.password
        }
        var UserModel = new User();        
        UserModel.verify(dadosLog, function(jsonSkyToken){
            // console.log(jsonSkyToken);
            if(jsonSkyToken != undefined && jsonSkyToken != null){
                res.json(jsonSkyToken.access_token);
            }
            else{
                res.json(null);  
            }
        });
    }catch(erros){
        res.render('admin/login', {
            title : 'Login',
            // message : {},
            erros : erros
        });
    }
});

module.exports = router;