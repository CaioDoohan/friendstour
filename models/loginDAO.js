var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var bcrypt = require('bcryptjs');
var db;
var connection;

var UserDAO = function(){
    db = mysql.createConnection(config.mysqlOptions);
}

UserDAO.prototype.createUser = function(newUser, callback){
    var User = {

        username : newUser.username,
        password : newUser.password,
        email : newUser.email,
        name : newUser.name
    } 

    db.then(function(conn){

        connection = conn;

        bcrypt.genSalt(10, function(err, salt) {

            bcrypt.hash(User.password, salt, function(err, hash) {
 
                User.password = hash;
                console.log(User);
                var insertUser = "INSERT INTO user(username, password,email,name) VALUES (?,?,?,?)";

                connection.query(insertUser,User, function(err, callback){

                    if(err) throw chalk.yellow(err);
                    return callback;
                });
                
            });
        });

    })
    
}


module.exports = UserDAO;

