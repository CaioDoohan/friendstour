var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var moment = require('moment');
var db;
var connection;

var Imagem = function(){
    db = mysql.createConnection(config.mysqlOptions);
}
 
Imagem.prototype.insertImages = function(object){
    var home_id;
    var det = [];
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
        var sqlEdit = "INSERT INTO images_det SET ? ;select LAST_INSERT_ID()";

        for(var k = 0; k < object.det_img.length; k++){

            detname_img.push({
                name_img : object.det_img[k].name_img,
            });

            connection.query(sqlEdit,detname_img[k],function(err,data){
                console.log('ultimno id', data);
            });
        }

        // console.log(detname_img);
/*
        for(var i = 0; i < detname_img.length; i++){
            
            var getDet = ("SELECT det_id from images_det where name_img = '" + detname_img[i].name_img + " ' order by 1 desc limit 1");

            connection.query(getDet, function(erro, result){

                for(var k = 0; k < result.length; k++){
                    
                    det.push({
                        det_id : result[k].det_id
                    });
                    console.log(chalk.blue(det[0].det_id));
                    //NÃO CONSIGO RETORNAR DET PARA O PRÓXIMO .THEN()
                }
            });
        }      */  

    }).then(function(){
        
    });

}

module.exports = Imagem;
