var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
// var passport = require('passport');
var validator = require('express-validator');
var User    = require("../models/loginDAO.js");
// var auth = require("../auth.js")();

router.get('/',function(req, res, next) {
    res.render('admin/conta', { title: 'Friendstour - Conta', erros : {} });    
});

router.post('/register', function(req,res,next){

    var UserModel = new User();

    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Nome é obrigatório').notEmpty();
    req.checkBody('username', 'Nome de usuário é obrigatório').notEmpty();
    req.checkBody('email', 'Email é obrigatório').notEmpty();
    req.checkBody('email', 'Formato de email inválido').isEmail();
    req.checkBody('password', 'Senha é obrigatório').notEmpty();
    req.checkBody('password2', 'Senhas diferentes').equals(req.body.password);

    var erros = req.validationErrors();

    if(erros){
        res.render('admin/conta', {
            title : 'Teste',
            message : {},
            erros : erros
        });
    }else{
        var newUser = ({
            name: name,
			email:email,
			username: username,
			password: password
        });

        UserModel.createUser(newUser, function(erro, callback){

            // console.log(newUser);

        });

    }
});

// router.post("/login", function(req, res) {

//     console.log(req.body);

//     if (req.body.email && req.body.password) {

//       var email = req.body.email;
//       var password = req.body.password;
//       var user = users.find(function(u) {
//         return u.email === email && u.password === password;
//       });

//       if (user) {
//         var payload = {id: user.id};
//         var token = jwt.encode(payload, cfg.jwtSecret);
//         res.json({token: token});

//       } else {
//         res.sendStatus(401);
//       }

//     } else {
//       res.sendStatus(401);
//     }
//   });

module.exports = router;