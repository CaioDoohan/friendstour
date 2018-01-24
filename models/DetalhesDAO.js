var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var db;
var connection;

var DetalhesDAO = function(){
    db = mysql.createConnection(config.mysqlOptions);
}
 
DetalhesDAO.prototype.getId = function(id,callback){
    db.then(function(conn){
        
        conn.query('select * from produto where id_prod = ' + id, callback);

        conn.end();
    });
}

module.exports = DetalhesDAO;

