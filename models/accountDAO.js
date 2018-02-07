var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var crypto = require('crypto');
var db;
var connection;

var UserDAO = function(){
    db = mysql.createConnection(config.mysqlOptions);
}

UserDAO.prototype.getAction = function(callback){
    db.then(function(conn){
        connection = conn;
        connection.query("Select * from actions order by action_id asc", function(err, resultado){
            if(resultado != null){
                callback(0, resultado);
            }
            else{
                callback(err, null);
            }
        });
    })
}
UserDAO.prototype.createUser = function(newUser, callback){
    var actions;
    var teste;
    var idUser;
    db.then(function(conn){
        connection = conn;
        var hash =  crypto.createHash('md5').update(newUser.password).digest("hex");
        var inst = [
            newUser.username,
            hash,
            newUser.email,
            newUser.name,
        ];
        var insertUser = "INSERT INTO user(username,password,email,name) VALUES(?,?,?,?)";
        connection.query(insertUser, inst, function(err, data){
            if(err){
                // console.log(err);
                teste = {
                    msg : err.sqlMessage
                }
                if( err.code == 'ER_DUP_ENTRY'){
                    teste = {
                        msg : 'Campo com dados duplicados'
                    }
                }
                callback(teste);
            }
            else{
                idUser = data.insertId;
                for(var i = 0; i < newUser.action.length; i++){
                    var sqlAction = "INSERT INTO action_user(action_id, user_id) VALUES("+ newUser.action[i] +","+ idUser +")";
                    connection.query(sqlAction, function(err,result){
                        if(err){
                            // console.log(err);
                            teste = {
                                msg : err.sqlMessage
                            }
                            callback(teste);
                        }
                        else{
                            // console.log("USUARIO + ACTIONS");
                            callback('1');
                        }
                    });
                }
            }
        })
    })  
}

UserDAO.prototype.verifyUsername = function(user, validate){
    // console.log(chalk.green(user));
    if(user != undefined && user != null){
        db.then(function(conn){
            connection = conn;
            var findUser = ("SELECT * FROM user WHERE username='" + user + "' ");
            // console.log(findUser);
            connection.query(findUser, function(err, callback){
                if(err) throw err;
                
                else if(callback.length > 0){
                //    console.log("Usuario em uso");
                   return validate(0, false);
                }
                else{
                    // console.log("Usuario disponível");
                    return validate(0, true); 
                }
            });
            connection.end();
        });
    }else{
        return validate(0, undefined);
    }
}

UserDAO.prototype.verifyEmail = function(email, validate){
    // console.log(chalk.green(email));
    if(email != undefined && email != null){
        db.then(function(conn){
            connection = conn;
            var findEmail = ("SELECT * FROM user WHERE email='" + email + "' ");
            // console.log(findUser);
            connection.query(findEmail, function(err, callback){
                if(err) throw err;
                
                else if(callback.length > 0){
                //    console.log("Usuario em uso");
                   return validate(0, false);
                }
                else{
                    // console.log("Usuario disponível");
                    return validate(0, true); 
                }
            });
            connection.end();
        });

    }else{
        return validate(0, undefined);
    }
}
module.exports = UserDAO;

