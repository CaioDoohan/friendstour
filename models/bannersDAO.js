var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var moment = require('moment');
var db;
var connection;

var Banners = function(){
    db = mysql.createConnection(config.mysqlOptions);
}

Banners.prototype.getAllBanners = function(banners){
    db.then(function(conn){
        connection = conn;

        var options = "banner_id,data_criacao, banner, ativo_banner";

        var sqlGet = ("SELECT "+ options + " from banners order by data_criacao");

        connection.query(sqlGet, function(erro,result){
            console.log(result);
            if(erro){
                banners(1, 0);
            }
            else{
                banners(0, result);
            }
        })

        connection.end();
    });
}

Banners.prototype.addBanner = function(banner, callback){
    console.log("3-)BANNER:", banner)

    db.then(function(conn){
        
        connection = conn;

        if( banner != undefined && banner != null ){
            var sqlInsert = ("INSERT INTO banners(banner) VALUE('" + banner + "')");

            connection.query(sqlInsert, function(erro,result){
                if(erro){
                    console.log("1-)Result:", erro);
                    callback(1, 0);
                }
                else{
                    console.log("1-)Result:", result);
                    callback(0, 1);
                }
            })

            connection.end();
        }
    })
    
}

Banners.prototype.removeBanner = function(id, callback){
    db.then(function(conn){
        connection = conn;

        var sqlRemove = ("DELETE FROM banners WHERE banner_id = " + id);
        
        connection.query(sqlRemove);

        return callback(0,1);
    });
}

Banners.prototype.desativarBanner = function(id, status,callback){
    db.then(function(conn){
        connection = conn;

        console.log(id, status);

        if( status == 'true' ){
            var sqlDest = ("UPDATE banners SET ativo_banner = b'0' WHERE banner_id = " + id );

        }else {
            var sqlDest = ("UPDATE banners SET ativo_banner = b'1' WHERE banner_id = " + id );
        }

        //console.log(sqlDest);
        connection.query(sqlDest,function(err, result){
            //console.log(result);
            if(err){
                callback(1, 0);
            }
            else{
                callback(0, 1);
            }
        });

    })
}

module.exports = Banners;