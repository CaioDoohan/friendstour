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
        //console.log("THIS",fields);
        //console.log("THIS",type);
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
        //console.log(sqlGet);
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

Galeria.prototype.getImages = function(id, imgs){
    //console.log("MODEL", id);
    var idHome;
    var idsDet = new Array();
    var home = {};
    var det = {};
    var imagens = {};
    db.then(function(conn){
        connection = conn;

        var sqlGet = ("SELECT home_id FROM home_prod WHERE prod_id = "+ id );
        
        connection.query(sqlGet, function(erro,result){
            if(erro || result[0] == undefined){
                //console.log("ENTROU IF MODEL");
                imgs(1, undefined);
            }else{
                idHome = result[0].home_id;
            }
        })

        return connection.query("SELECT 1");

    }).then(function(){
        //console.log("THEN",idHome); 

        var sqlGet = ("SELECT name_img, data_criacao FROM images_home WHERE home_id = "+ idHome);
        //console.log(sqlGet);

        connection.query(sqlGet, function(erro, result){
            if(erro || result[0] == undefined){
                //console.log("ENTROU IF MODEL");
                imgs(1, undefined);
            }else{
                //console.log(result);
                home = {
                    nome : result[0].name_img,
                    data : moment(result[0].data_criacao).format('DD/MM/YYYY')
                }
            }
        })

        return connection.query("SELECT 1");
    }).then(function(){

        //console.log(home);

        var sqlGet = ("SELECT det_id FROM det_prod WHERE prod_id = "+ id );

        console.log(sqlGet);
        connection.query(sqlGet, function(erro,result){
            console.log(result);
            /*
            if(erro || result[0] == undefined){
                imgs(1, undefined);
            }else{
                for(var i = 0; i < result.length; i++){
                    idsDet.push(result[i].det_id);
                }
            }*/
        });

        return connection.query("SELECT 1");
    }).then(function(){
        console.log("THIS", idsDet);
    })
}

module.exports = Galeria;