var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var crypto = require('crypto');
var db;
var connection;

var UserDAO = function(){
    db = mysql.createConnection(config.mysqlOptions);
}

UserDAO.prototype.getUsers = function(callback){
    db.then(function(conn){
        connection = conn;

        var options = "user_id, username, name, ativo";

        connection.query("SELECT "+ options +" from user WHERE user_id != 1 order by user_id asc", function(erro,result){
            console.log(result);
            console.log("ERRO",erro);
            if(erro != null){
                return callback(undefined);
            }else{
                return callback(result);
            }
        });

        return connection.end();
    })
}

UserDAO.prototype.getAction = function(callback){
    db.then(function(conn){
        connection = conn;
        connection.query("Select * from actions order by action_id asc", function(err, resultado){
            if(resultado != null){
                callback(0, resultado);
                return connection.end();
            }
            else{
                callback(err, null);
                return connection.end();
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
        console.log("INST", inst);
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
                callback(teste,0);
                return connection.end();
            }
            else{
                idUser = data.insertId;
                for(var i = 0; i < newUser.action.length; i++){
                    var sqlAction = "INSERT INTO action_user(action_id, user_id) VALUES("+ newUser.action[i] +","+ idUser +")";
                    console.log(sqlAction);
                    connection.query(sqlAction, function(err,result){
                        if(err){
                            // console.log(err);
                            teste = {
                                msg : err.sqlMessage
                            }
                            callback(teste,0);
                            return connection.end();
                        }
                    });
                }
                console.log("Usuário criado");
                callback(0,1);
                return connection.end();
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
                   validate(0, false);
                }
                else{
                    // console.log("Usuario disponível");
                    validate(0, true); 
                }
            });
            connection.end();
        });
    }else{
        validate(0, undefined);
        return connection.end();
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
            return connection.end();
        });

    }else{
        validate(0, undefined);
        return connection.end();
    }
}

UserDAO.prototype.remove = function(id, cb){
    console.log("ENTROU MODEL");
    console.log("ID:",id);
    var acess = true;
    db.then(function(conn){
        connection = conn;
        console.log("ID - ", id);
        var sqlRemove = ("DELETE FROM user WHERE user_id = "+ id);
        conn.query(sqlRemove, function(erro, result){
            console.log(result);
            if(erro || result == undefined){
                return acess = false;
            }
        });

        return connection.query("SELECT 1");
    }).then(function(){
        if(acess != false){
            var sqlRemove =("DELETE FROM action_user WHERE user_id = "+ id);
            connection.query(sqlRemove, function(erro,result){
                console.log("result - ", result);
                if(erro || result == undefined){
                    cb(undefined);
                }else{
                    cb(1);
                }
            });
            console.log("CONEXÃO FECHADA");
            return connection.end();
        }else{
            cb(undefined);
            return connection.end();
        }
        
    })
}

UserDAO.prototype.desativar = function(id, status, callback){

    db.then(function(conn){
        connection = conn;

        console.log(id, status);

        if( status == 'true' ){
            var turnOFF = false;
            var sqlDest = ("UPDATE user SET ativo = " + turnOFF + " WHERE user_id = " + id );

        }else {
            var turnON = true;
            var sqlDest = ("UPDATE user SET ativo = " + turnON + " WHERE user_id = " + id );
        }

        console.log(sqlDest);
        connection.query(sqlDest,function(err, result){
            console.log(result);
            if(err){
                callback(1, 0);
            }
            else{
                callback(0, 1);
            }
        });

        connection.end();

    })

}

module.exports = UserDAO;

