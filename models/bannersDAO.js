var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var moment = require('moment');
var fs = require('file-system');
var path = new require('path');
var jsonPath = path.join(__dirname, '..', 'public', 'images', 'uploads', 'banners','origin');
var jsonCroped = path.join(__dirname, '..', 'public', 'images', 'uploads', 'banners','croped');
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
            // console.log(result);
            if(erro || result[0] == undefined){
                banners(1, undefined);
            }
            else{
                banners(0, result);
            }
        })

        connection.end();
    });
}

Banners.prototype.addBanner = function(banner,url, callback){

    db.then(function(conn){
        
        connection = conn;
        if( banner != undefined && banner != null ){
            var sqlInsert = ("INSERT INTO banners(banner,url) VALUES('" + banner + "','"+ url +"')");

            connection.query(sqlInsert, function(erro,result){
                if(erro){
                    // console.log("1-)Result:", erro);
                    callback(1, 0);
                }
                else{
                    // console.log("1-)Result:", result);
                    callback(0, 1);
                }
            })

            return connection.end();
        }else{
            return connection.end();
        }
        
    })
    
}

Banners.prototype.removeBanner = function(id,name,callback){
    db.then(function(conn){
        connection = conn;
        // console.log(name);
        var sqlRemove = ("DELETE FROM banners WHERE banner_id = " + id);
        
        connection.query(sqlRemove, function(erro, result){
            if(erro){
                return callback(1,0);
            }else{
                var origin = (jsonPath + "\\" + name); 
                fs.unlink(origin,function(err){
                    if (err) throw err;
                    // console.log(chalk.red(origin," - DELETADA"));
                });

                var croped = (jsonCroped + "\\" + name); 
                fs.unlink(croped,function(err){
                    if (err) throw err;
                    // console.log(chalk.red(croped," - DELETADA"));
                });
            }
            return callback(0,1);
        });
        
        return connection.end();
    });
}

Banners.prototype.desativarBanner = function(id, status,callback){
    db.then(function(conn){
        connection = conn;

        // console.log(id, status);

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
                return connection.end();
            }
            else{
                callback(0, 1);
                return connection.end();
            }
        });

    })
}

module.exports = Banners;