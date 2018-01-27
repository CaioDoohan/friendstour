var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var moment = require('moment');
var db;
var connection;

var Imagem = function(){
    db = mysql.createConnection(config.mysqlOptions);
}
 
Imagem.prototype.getAllAnuncio = function(callback){
    db.then(function(conn){
        
        conn.query('select * from produto order by datacriacao_prod', callback);

        // conn.end();
    })
}

Imagem.prototype.insertImages = function(object){
    var home_id;
    var det_id = {};
    db.then(function(conn){

        connection = conn;

        var name_img = object.home_img;
        // console.log(name_img)
        var sqlHome = "INSERT INTO images_home(name_img) VALUE(?)";
        connection.query(sqlHome, name_img);

        var getHome = ("SELECT home_id from images_home where name_img = '" + name_img + " ' order by 1 desc limit 1"); 

        return connection.query(getHome);

    }).then(function(idHome){

        home_id = idHome;
        
        var detname_img = [];
        var sqlEdit = "INSERT INTO images_det SET ?";

        for(var k=0; k < object.det_img.length; k++){

            detname_img.push({
                name_img : object.det_img[k].name_img,
            });

            connection.query(sqlEdit,detname_img[k]);
        }

        console.log(detname_img);
        
        for(var i = 0; i < detname_img.length; i++){

            var getDet = ("SELECT det_id from images_det where name_img = '" + detname_img[i].name_img + " ' order by 1 desc limit 1");
            console.log(getDet);
            
            connection.query(getDet, function(erro,result){
                console.log(result[i].det_id);
                //NÃO CONSIGO RETORNAR A PROPRIEDADE DET_ID DO RESULTADO DA QUERY
                // QUERO RETORNAR ELAS PRA PODER DAR UM .PUSH() 
            });

        }


    });

}

module.exports = Imagem;
