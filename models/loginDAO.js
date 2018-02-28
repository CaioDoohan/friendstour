var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var configJwt = require('../config/config');
var chalk = require('chalk');
var crypto = require('crypto');
var jwt = require('jwt-simple');
var db;
var connection;

var LoginDAO = function(){
    db = mysql.createConnection(config.mysqlOptions);
}

LoginDAO.prototype.verify = function(dadosLog, callback){
    db.then(function(conn){
        var connection = conn;

        var hash =  crypto.createHash('md5').update(dadosLog.password).digest("hex");

        dadosLog.password = hash; 

        var searchSQL = ("Select * from user where username = '" + dadosLog.username + "'and password = '" + dadosLog.password + "' and ativo = b'1' ");

        connection.query(searchSQL, function(err, result){
            if(err) throw err;
            else if (result[0] == undefined || result[0] ==  null) {
                return callback(null);
            } else {
                const payload = {
                    id : result[0].user_id,
                    username : result[0].username,
                    admin : result[0].admin
                };
                var token = jwt.encode(payload, configJwt.jwtSecret);
                return callback({access_token:token});
            }
        });
        connection.end();
    }); 
}

LoginDAO.prototype.getByID = function(userX, callback){

    db.then(function(conn){
        connection = conn;
        var sqlSearch = "SELECT * FROM user WHERE user_id = ? AND username = ?";

        connection.query(sqlSearch, [userX.id, userX.username], function(err,result){

            if(err) throw err;

            else if( result[0] == undefined ){
                console.log(chalk.blue("USUARIO NAO ENCONTRADO"));
                return callback(null);
            }
            else{
                console.log(chalk.blue("USUARIO ENCONTRADO"));
                return callback(result);
            }
        });

        connection.end();
    })   
}

module.exports = LoginDAO;
