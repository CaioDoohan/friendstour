var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var moment = require('moment');
var fs = require('file-system');
var path = new require('path');
var jsonPath = path.join(__dirname, '..', 'public', 'images', 'uploads', 'prods');
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

        return connection.end();
    })
}

Galeria.prototype.getImages = function(id, imgs){
    //console.log("MODEL", id);
    var idHome;
    var idsDet = new Array();
    var nameDet = new Array();
    var datesDet = new Array();
    var ativo = new Array();
    var home = {};
    var det = {};
    var imagens = {};
    db.then(function(conn){
        connection = conn;

        var sqlGet = ("SELECT home_id FROM home_prod WHERE prod_id = "+ id );
        
        connection.query(sqlGet, function(erro,result){
            //console.log(chalk.yellow("home id:", id));
            if(erro || result[0] == undefined){
                //console.log("ENTROU IF MODEL");
                // imgs(1, undefined);
                return idHome = undefined;
            }else{
                return idHome = result[0].home_id;
            }
        })

        return connection.query("SELECT 1");

    }).then(function(){
        //console.log("THEN",idHome); 
        if( idHome != undefined ){
            var sqlGet = ("SELECT name_img, data_criacao, ativo_prod FROM images_home WHERE home_id = "+ idHome);
        //console.log(sqlGet);

            connection.query(sqlGet, function(erro, result){
                if(erro){
                    //console.log("ENTROU IF MODEL");
                    imgs(1, undefined);
                }else{
                    //console.log(result);
                    home = {
                        id : idHome,
                        nome : result[0].name_img,
                        data : moment(result[0].data_criacao).format('DD/MM/YYYY'),
                        ativo : result[0].ativo_prod
                    }
                }
            })

            return connection.query("SELECT 1");
        }else{
            return home = undefined;
        }
        

        return connection.query("SELECT 1");
    }).then(function(){

        //console.log(home);

        var sqlGet = ("SELECT det_id FROM det_prod WHERE prod_id = "+ id );

        //console.log(sqlGet);
        connection.query(sqlGet, function(erro,result){
            // console.log(chalk.blue("DETS IDS:",result));
            
            if(erro || result[0] == undefined){
                // console.log(chalk.blue("DETS IDS:",undefined));
                return idsDet = undefined;
            }else{
                for(var i = 0; i < result.length; i++){
                    idsDet.push(result[i].det_id);
                }

                return idsDet;
            }

            return connection.query("SELECT 1");
        });

        return connection.query("SELECT 1");
    }).then(function(){
        // console.log("THIS", idsDet);
    
        if( idsDet != undefined ){
            var sqlGet = ("SELECT name_img, data_criacao, ativo_prod FROM images_det WHERE det_id in ("+idsDet+")");
            //console.log(sqlGet);

            connection.query(sqlGet, function(erro, result){
                //console.log("RESULTADO",result);
                if(erro){
                    //console.log("ENTROU IF MODEL");
                    imgs(1, undefined);
                }else{
                    for(var i = 0; i < result.length; i++){
                        nameDet.push(result[i].name_img);
                        datesDet.push(moment(result[i].data_criacao).format('DD/MM/YYYY'));
                        ativo.push(result[i].ativo_prod);
                    }
                    
                    det = {
                        id : idsDet,
                        nome : nameDet,
                        data : datesDet,
                        ativo : ativo
                    }

                    return connection.query("SELECT 1");
                }

                return connection.query("select 1");
            })
        }else{
            det = undefined;
        }
        

        return connection.query("SELECT 1");
    }).then(function(){
        imagens = {
            home : home,
            det : det,
        }
        // console.log(imagens);
        imgs(0,imagens);
        return connection.end();
    })
}

Galeria.prototype.remover = function(idImagem,type, cb){
    // console.log("MODEL", idImagem, type);
    var acess = true;
    var removeProd;
    var removeImg;
    var sqlGet;
    var nameImg;
    var prod;
    var id = idImagem
    db.then(function(conn){
        connection = conn;
        switch(type){
            case 'home':
                removeProd = ("DELETE FROM home_prod WHERE home_id = "+ id);
                removeImg = ("DELETE FROM images_home WHERE home_id = "+ id);
                sqlGet = ("SELECT name_img FROM images_home WHERE home_id = "+ id);
                // console.log("->",removeProd);
                // console.log("->",removeImg);
                // console.log("->",sqlGet);
                break;

            case 'det':
                removeProd = ("DELETE FROM det_prod WHERE det_id = "+ id);
                removeImg = ("DELETE FROM images_det WHERE det_id = "+ id);
                sqlGet = ("SELECT name_img FROM images_det WHERE det_id = "+ id);
                // console.log("->",removeProd);
                // console.log("->",removeImg);
                // console.log("->",sqlGet);
            break;

            return connection.query("SELECT 1");
        }
        
        
        connection.query(removeProd, function(erro,result){
            // console.log("RESULTADO",result);
            if(erro || result == undefined){
                // console.log(chalk.yellow("PRODUTO SEM ESSA IMAGEM"));
            }
            return connection.query("select 1");
        });

        return connection.query("SELECT 1");
        
    }).then(function(){
        // console.log("ACESS",acess);
        if(acess != false){
            // console.log("ACESS TRUE");
            connection.query(sqlGet, function(erro, result){
                // console.log("IMAGE NOME", result);
                if(erro || result == undefined){
                    // cb(1,0);
                    return acess = false;   
                }else{
                    return nameImg = result[0].name_img
                }

                return connection.query("SELECT 1");
            })
        }else{
            // console.log("ACESS FALSE");
            cb(1,0);
            return connection.end();
        }
        return connection.query("SELECT 1");
    }).then(function(){
        // console.log("ACESS",acess);
        if(acess != false){
            connection.query(removeImg, function(erro, result){
                // console.log("QUERY PARA REMOVER A IMAGEM DA PASTA",result);
                if(erro){
                    cb(1,0);
                    return acess = false;
                }else{
                    // console.log("FOI PRA PASTA");
                    var img = (jsonPath + "\\" + nameImg); 
                    fs.unlink(img,function(err){
                        if (err) throw err;
                        // console.log(chalk.red(img," - DELETADA"));
                    });
                    cb(0,1);
                    // console.log(chalk.yellow("CONEXÃO FECHADA"));
                    return connection.end();
                }
                return connection.query("select 1");
            });
        }else{
            // console.log("ACESS FALSE");
            // cb(1,0);
            // return connection.end();
        }
    });
}

Galeria.prototype.desativar = function(id, status,type,callback){
    var sqlDest;
    db.then(function(conn){
        connection = conn;

        // console.log("DADOS",id, status);

        switch(type){
            case 'home':
                if( status == 'true' ){
                    sqlDest = ("UPDATE images_home SET ativo_prod = b'0' WHERE home_id = " + id );
        
                }else {
                    sqlDest = ("UPDATE images_home SET ativo_prod = b'1' WHERE home_id = " + id );
                }
                break;

            case 'det':
                if( status == 'true' ){
                    sqlDest = ("UPDATE images_det SET ativo_prod = b'0' WHERE det_id = " + id );
        
                }else {
                    sqlDest = ("UPDATE images_det SET ativo_prod = b'1' WHERE det_id = " + id );
                }
            break;

            return connection.query("SELECT 1");
        }         

        // console.log(sqlDest);
        connection.query(sqlDest,function(err, result){
            //console.log(result);
            if(err){
                callback(1, 0);
                connection.end();
            }
            else{
                callback(0, 1);
                connection.end();
            }
        });

    })
}

module.exports = Galeria;