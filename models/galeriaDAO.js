var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var moment = require('moment');
var db;
var connection;

var Galeria = function(){
    db = mysql.createConnection(config.mysqlOptions);
}

Galeria.prototype.getIds = function(field, type, cb){

    db.then(function(conn){
        connection = conn;

        var fields = field;
        console.log("THIS",fields);
        console.log("THIS",type);
        var sqlGet;
        var types;

        switch(fields){
            case 'promo_prod':
                types = "b'0'";
                sqlGet = ("SELECT id_prod FROM produto WHERE promo_prod = " + types + " order by datacriacao_prod desc");
            break;

            case 'nacional_prod':
                types = (type == 0 ? "b'0'" : "b'1'");
                sqlGet = ("SELECT id_prod FROM produto WHERE promo_prod = " + types + " order by datacriacao_prod desc");
            break;

            case 'id_cat':
                types = type;
                sqlGet = ("SELECT id_prod FROM cat_prod WHERE id_cat = " + types + " order by id_prod desc");
            break;
        }
        console.log(sqlGet);
        connection.query(sqlGet, function(erro,result){
            if(erro){
                cb(erro, 0);
            }else{
                cb(0, result);
            }
        });

        connection.end();
    })
}

module.exports = Galeria;