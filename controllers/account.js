var express   = require('express')
var router    = express.Router();
var moment    = require('moment');
var chalk     = require('chalk');
var validator = require('express-validator');
var User      = require("../models/accountDAO.js");

router.get('/',function(req, res, next) {
    var UserModel = new User();

    UserModel.getAction(function(err, result){
        if( result != null){
            res.render('admin/conta', { title: 'Friendstour - Registro', erros : {}, correct : {} , action : result });  
        }else{
            res.render('admin/conta', { title: 'Friendstour - Registro', erros : err, correct : {} , action : result });  
        }
    });
      
});


router.post('/register', function(req,res,next){

    var UserModel = new User();
    var name      = req.body.name;
    var username  = req.body.username;
    var email     = req.body.email;
    var password  = req.body.password;
    var password2 = req.body.password2;
    var action    = req.body.action;

    req.checkBody('name',     'Campo "Nome" vazio ou muito curto').notEmpty().isLength({ min : 3 });
    req.checkBody('username', 'Campo "Nome de usuário" vazio ou muito curto').notEmpty().isLength({ min : 3 });
    req.checkBody('email',    'Email é obrigatório').notEmpty();
    req.checkBody('email',    'Formato de email inválido').isEmail();
    req.checkBody('password', 'Senha deve conter pelo menos 8 dígitos').notEmpty().isLength({ min : 8 });
    req.checkBody('password2','Senhas diferentes').equals(req.body.password);

    var erros = req.validationErrors();

    if(erros){        
        return res.json( erros );
    }
    else{
        var newUser = ({
            name: name,
			email: email,
			username: username,
            password: password,
            action : action
        })
        UserModel.createUser(newUser, function(erro){
            if(erro == '1'){
                msg = "Cadastro efetuado com sucesso!";
                msg = {
                    msg : msg
                }
                data = {
                    msg : msg
                }
                return res.write( data.toString() );
            }
            else{
                data = {
                    msg : 'Credenciais incorretas ou usuário inexistente'
                }
                return res.write( data );
            }
        });
    }
});

router.post('/validate', function(req,res,next){

    var email = req.body.email;
    var user  = req.body.user;
    var msg;
    var type;
    if(user){
        var UserModel = new User();
        UserModel.verifyUsername(user, function(err, callback){
            // console.log(chalk.green(callback));
            if(callback == false){
                msg = "Usuário em uso";
                type = false;
                // console.log(chalk.blue(msg));
                return res.json( {msg : msg, type : type} );
                // return msg;
            }else if(callback == true){
                msg = "Usuário disponível";
                type = true;
                return res.json({msg : msg, type : type});
            }else{
                // console.log(chalk.blue(err));
                return res.json({msg : {} , type : undefined});
            }
        });

    }else if(email){
        // console.log("Canhotinho");
        var UserModel = new User();
        UserModel.verifyEmail(email, function(err, callback){
            // console.log(chalk.green(callback));
            if( callback == false ){
                msg = "Email já cadastrado";
                type = false;
                // console.log(chalk.blue(msg));
                return res.json( {msg : msg, type : type} );
                // return msg;
            }
            else if(callback == true){
                msg = "Email disponível";
                type = true;
                // console.log(chalk.blue(msg));
                return res.json({msg : msg, type : type});
            }else{
                return res.json({msg : {} , type : undefined});
            }
        });
    }else{
        return;
    }
});

module.exports = router;