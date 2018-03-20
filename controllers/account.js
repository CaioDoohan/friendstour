var express   = require('express')
var router    = express.Router();
var moment    = require('moment');
var chalk     = require('chalk');
var validator = require('express-validator');
var User      = require("../models/accountDAO.js");

router.get('/',function(req, res, next) {
    var UserModel = new User();
    var user;
    UserModel.getUsers(function(users){
        if(users != undefined){
            // console.log(users);
            for(var i = 0; i < users.length; i++){
                users[i].user_id;
                users[i].username;
                users[i].name;
                users[i].ativo;
            }

        }else{
            // console.log("== ->");
            users = undefined;
        }
        // console.log(user);
        res.render('admin/user', {title: 'Friendstour - Usuários', usuario : users });
    });
      
});

router.get('/cadastro',function(req, res, next) {
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
        var newUser = {
            name: name,
			email: email,
			username: username,
            password: password,
            action : action
        }
        // console.log(chalk.blue("NEW USER FROM CONTROL:", newUser));
        UserModel.createUser(newUser, function(erro,result){
            // console.log(result);
            if(result != 0){
                data = {
                    msg : "Cadastro efetuado com sucesso!"
                }
                res.json(data);
            }
            else{
                data = {
                    msg : 'Credenciais incorretas ou usuário inexistente'
                }
                res.json(data);
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

router.post('/remover', function(req,res){
    var id = req.body.id;
    var UserModel = new User();
    // console.log(id);
    UserModel.remove(id, function(callback){
        if(callback == undefined){
            res.json({ 
                msg : "ERRO: repita a operação"
             })
        }else{
            res.json({
                msg : "Usuário removido"
            })
        }
    });
});

router.post('/desativar', function(req,res){
    var id = req.body.id;
    var status = req.body.turn;

    var UserModel = new User();

    UserModel.desativar(id,status, function(erro, result){
        if( erro == 1 || result == undefined){
            res.json({ 
                msg : "ERRO: repita a operação"
             })
        }else{
            res.json({
                msg : "Status alterado"
            })
        }

    });

});


module.exports = router;