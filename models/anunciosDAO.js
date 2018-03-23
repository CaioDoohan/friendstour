var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var fs = require('fs');
var path = new require('path');
var chokidar = require('chokidar');
var db;
var connection;

var del = require('del');


var Anuncio = function(){
    db = mysql.createConnection(config.mysqlOptions);
}
 
Anuncio.prototype.getAllAnuncio = function(callback){
    db.then(function(conn){
        var options = "id_prod, nome_prod, vagas_prod, ativo_prod, datacriacao_prod"
        conn.query("select "+ options +" from produto order by datacriacao_prod",function(erro, result){
            if(erro != null){
                return callback(undefined);
            }else{
                return callback(result);
            }
        });
        
        conn.end();
    })
}

Anuncio.prototype.getCategoria = function(callback){
    db.then(function(conn){
        conn.query('select * from categoria order by id_cat asc', function(erro,result){
            if(erro){
                return callback(erro, 0);
            }else{
                return callback(0, result);
            }
        });
        //conn.end();
        // conn.end();
    })
}

Anuncio.prototype.getInclusos = function(callback){
    db.then(function(conn){
        conn.query('select * from inclusos', function(erro,result){
            //console.log("RESULT", result);
            if(erro){
                return callback(erro, 0);
            }else{
                // console.log(result);
                return callback(0, result);
            }
        });

        conn.end();
    })
}

Anuncio.prototype.addAnuncio = function(dadosForm,imgHome,detImg, callback){
    var confirmacao;
    var idProd;
    var id;
    var idHome;
    var arrIdsDet = [];
    db.then(function(conn){
        var insert = "INSERT INTO produto(nome_prod,desc_prod,data_prod,valor_prod,nacional_prod,vagas_prod,parcelas_prod,texto_prod,promo_prod) VALUES(?,?,?,?,?,?,?,?,?)";

        connection = conn;

        var tabProd = [
            dadosForm.nome_prod,
            dadosForm.desc_prod,
            dadosForm.data_prod,
            dadosForm.valor_prod,
            (dadosForm.nacional_prod == "on" ? true : false),
            (dadosForm.vagas_prod == "on" ? true : false),
            dadosForm.parcelas_prod,
            dadosForm.texto_prod,
            (dadosForm.promo_prod == "on" ? true : false)
        ];

        connection.query(insert,tabProd, function(erro, result){
            if(erro){
                //console.log("entrou erro!", result);
                return callback(erro, 0);
            }
            else{
                // console.log(chalk.blue("ID DO ANUNCIO:", result.insertId));
                id = result.insertId;
            }
        });

        return connection.query("SELECT 1");
    }).then(function(){
        if( dadosForm.incluso != undefined ){
            for(var k = 0; k < dadosForm.incluso.length; k++){
                var sqlInc = "insert into inc_prod(id_inc,id_prod) values("+ dadosForm.incluso[k] + "," + id + ")";
                connection.query(sqlInc);
            }
        }else{
            // console.log("SEM INCLUSOS");
        }
        
        
        return connection.query("SELECT 1");
    }).then(function(){

        for(var k = 0; k < dadosForm.categoria.length; k++){
            var sqlCat = "insert into cat_prod(id_cat,id_prod) values("+ dadosForm.categoria[k] + "," + id + ")";
            connection.query(sqlCat);
        }

        return connection.query("SELECT 1");
    }).then(function(){
        if(imgHome != undefined ){
            var homePath = imgHome.home;
            var sqlHome = ("INSERT INTO images_home(name_img) VALUE('" + homePath +"') " );
            console.log(sqlHome);
            connection.query(sqlHome, function(erro, result){
                if(erro){
                    callback(erro, 0);
                }else{
                    // console.log(result);
                    // console.log("ID RESULTANTE:",result.insertId);
                    idHome = result.insertId;
                }
            });

            return connection.query("SELECT 1");
        }else{
            idHome = null;
        }
        return connection.query("SELECT 1");

    }).then(function(){
        if( idHome != null ){
            var sqlHome = ("INSERT INTO home_prod(home_id,prod_id) VALUES("+ idHome + ","+ id + ")");
            // console.log(idHome);
            connection.query(sqlHome);
        }

        return connection.query("SELECT 1");

    }).then(function(){

        var detPaths = detImg;
        var idsDet = [];
        
        if( detPaths != undefined ){
            for(var i = 0; i < detPaths.length; i++){
                var sqlDet = ("INSERT INTO images_det(name_img) VALUE('" + detPaths[i] + "')");
                console.log(sqlDet);
                connection.query(sqlDet, function(err,result){      
                    if(err){
                        callback(err, 0);
                    }else{
                        gambiboa(result.insertId,arrIdsDet);

                    }
                });
            }
            return connection.query("SELECT 1");
        }

        return connection.query("select 1");

    }).then(function(){
        // console.log("AGORA SIM:", arrIdsDet);
        if( arrIdsDet != null ){

            for(var i = 0; i < arrIdsDet.length; i++){
                var sqlInsert = ("INSERT INTO det_prod(det_id, prod_id) VALUES("+ arrIdsDet[i] +","+ id +")");
    
                // console.log(sqlInsert);
                connection.query(sqlInsert);
            }
        }
        return callback(0,1);
    });
}

function gambiboa(value,array){
    array.push(value);
}

Anuncio.prototype.verifyEvent = function(event, validate){
    // console.log(chalk.green(email));
    if(event != undefined && event != null){
        db.then(function(conn){
            connection = conn;
            var findEvent = ("SELECT nome_prod FROM produto WHERE nome_prod ='" + event + "' ");
            // console.log(findUser);
            connection.query(findEvent, function(err, callback){
                if(err) throw err;
                
                else if(callback.length > 0){
                //    console.log("Usuario em uso");
                   return validate(0, false);
                }
                else{
                    // console.log("Usuario disponível");
                    return validate(0, true); 
                }
            });
            return connection.end();
        });

    }else{
        validate(0, undefined);
        return connection.end();
    }
}

Anuncio.prototype.getFullAnuncio = function(id, result){
    var idProd,
        categoria = [],
        incluso = [],
        prod = {},
        prodEdit = {}

    db.then(function(conn){

        connection = conn;

        idProd = id;

        var sqlGet = ("Select * from produto where id_prod = " + idProd );

        return connection.query(sqlGet);

    }).then(function(dados){

        prod = {
            id_prod : dados[0].id_prod,
            nome_prod : dados[0].nome_prod,
            desc_prod : dados[0].desc_prod,
            data_prod: dados[0].data_prod,
            valor_prod : dados[0].valor_prod,
            parcelas_prod : dados[0].parcelas_prod,
            texto_prod : dados[0].texto_prod,
            nacional_prod: dados[0].nacional_prod,
            promo_prod : dados[0].promo_prod,
            ativo_prod : dados[0].ativo_prod,
            vagas_prod : dados[0].vagas_prod,
            criacao : dados[0].datacriacao_prod
        };
        // console.log(chalk.blue(prod.data_prod));
        var sqlCat = ("select id_cat from cat_prod where id_prod =" + idProd);
        
        return connection.query(sqlCat);

    }).then(function(cat){

        for(var i = 0; i < cat.length; i++){

            categoria.push({
                id_cat : cat[i].id_cat
            });
            // console.log(chalk.blue(categoria[i].id_cat));

        }

        sqlInc = ("select id_inc from inc_prod where id_prod =" + idProd);

        return connection.query(sqlInc);

    }).then(function(inc){

        for(var i = 0; i < inc.length; i++){
            incluso.push({
                id_inc : inc[i].id_inc
            })
        }

        prodEdit = {
            id_prod : idProd,
            nome_prod : prod.nome_prod,
            desc_prod : prod.desc_prod,
            data_prod: prod.data_prod,
            valor_prod : prod.valor_prod,
            parcelas_prod : prod.parcelas_prod,
            texto_prod : prod.texto_prod,
            nacional_prod: prod.nacional_prod,
            promo_prod : prod.promo_prod,
            ativo_prod : prod.ativo_prod,
            vagas_prod : prod.vagas_prod,
            categoria : categoria,
            inclusos : incluso,
            criacao : prod.criacao
        };

        result(0,prodEdit);
        // connection.end();
    });
}

Anuncio.prototype.editAnuncio = function(dadosEdit, alteracao){
    //console.log(dadosEdit);

    var prod = {},
        id,
        catIds = [],
        incIds = [],
        prodAlterado = {};
        sqlPrefer = 'SET SQL_SAFE_UPDATES = 0';
    db.then(function(conn){

        connection = conn;
        connection.query(sqlPrefer);
        // console.log(chalk.blue("Preferences: OFF"));

        prod = {
            id_prod : dadosEdit.id_prod,
            nome_prod : dadosEdit.nome_prod,
            desc_prod : dadosEdit.desc_prod,
            data_prod : dadosEdit.data_prod,
            nacional_prod : (dadosEdit.nacional_prod == "on" ? true : false),
            promo_prod : (dadosEdit.promo_prod == "on" ? true : false),
            valor_prod : dadosEdit.valor_prod,
            parcelas_prod : dadosEdit.parcelas_prod,
            vagas_prod : (dadosEdit.vagas_prod == "on" ? true : false),
            texto_prod : dadosEdit.texto_prod
        }

        // console.log(prod);
        var sqlUpdate = ("UPDATE produto SET ? where id_prod = " + prod.id_prod);
        
        
        connection.query(sqlUpdate,prod, function(erro, result){
            if(erro){
                alteracao(erro, 0);
            }
        });
        return connection.query("SELECT 1");
    }).then(function(){

        id = dadosEdit.id_prod;

        var removeCat = ("DELETE FROM cat_prod WHERE id_prod = " + id);
        var upCat = ("INSERT into cat_prod SET ? ");
        
        connection.query(removeCat);
        //console.log(chalk.yellow("Categorias retiradas"));

        for(var i = 0; i < dadosEdit.categoria.length; i++){
            
            catIds.push({
                id_cat : dadosEdit.categoria[i],
                id_prod : dadosEdit.id_prod
            })
            connection.query(upCat, catIds[i], function(erro,result){
                if(erro){
                    alteracao(erro, 0);
                }
            });
        }
        connection.query("SELECT 1");
        //console.log(chalk.yellow("Categorias adicionadas"));

    }).then(function(){
        id = dadosEdit.id_prod;
        
        var removeInc = ("DELETE FROM inc_prod WHERE id_prod = " + id);
        var upInc = ("INSERT into inc_prod SET ? ");
        
        connection.query(removeInc);
        //console.log(chalk.yellow("Inclusos retirados"));

        for(var i = 0; i < dadosEdit.incluso.length; i++){
            
            incIds.push({
                id_inc : dadosEdit.incluso[i],
                id_prod : dadosEdit.id_prod
            })
            connection.query(upInc, incIds[i], function(erro,result){
                if(erro){
                    alteracao(erro, 0);
                }
            });
        }
        
        //console.log(chalk.yellow("Inclusos adicionados"));
        
        return connection.query("SELECT 1");
    }).then(function(){
        
        alteracao(null, 1);

        return connection.end();
    });
}

Anuncio.prototype.removeAnuncio = function(id, callback){
    var idProd;
    var idImg;
    var nameHome;
    var acess;
    var idDet = new Array();
    var nameDet = new Array();
    var sqlPrefer = 'SET SQL_SAFE_UPDATES = 0';

    var globalPath = path.join(__dirname,'..','public','images','uploads','prods');

    watcher = chokidar.watch(globalPath,{
        persistent: true
    });

    watcher.on('unlink', function(){
        console.log("UNLINK");
        watcher.close();
    });

    function test(array){
        for( var i = 0; i < array.length; i++){
            console.log("UNLINK", i);
            fs.unlink(array[i], function(erro){
                if(erro) throw erro;
            });
        }
        return true;
    }
    function removeThis(file,type){
        var teste = new Array();
        if( type != '1' ){
            var origin = (globalPath + "\\" + 'origin' + "\\" + file);
            var croped = (globalPath + "\\" + 'croped' + "\\" + file);
            var thumb = (globalPath + "\\" + 'thumb' + "\\" + file);
            
            teste.push(croped, thumb);

            if( test(teste)){
                console.log("AQUI");
                fs.unlink(origin, function(erro){
                    console.log(erro);
                });
            }

        }else{
            var origin = (globalPath + "\\" + 'origin' + "\\" + file);
            var croped = (globalPath + "\\" + 'croped' + "\\" + file);

            teste.push(origin, croped);

            for( var i = 0; i < teste.length; i++){
                console.log("UNLINK", i);
                fs.unlink(teste[i], function(erro){
                    if(erro) throw erro;
                });
            }
        }        
        
        return true;
    }

    db.then(function(conn){
        connection = conn;
        idProd = id;
        
        connection.query(sqlPrefer);
        var sqlRemove = ("DELETE FROM produto WHERE id_prod = " + idProd);
        
        connection.query(sqlRemove, function(erro, result){
            if(erro){
                callback(1,0);
                return acess = false;
            }else{
                return acess = true;
            }
        });
        return connection.query("SELECT 1");
    }).then(function(){
        // console.log("ACESS:",acess);
        if(acess == false){
            callback(1,0);
            return connection.end();
        }else{
            var sqlRemove = ("DELETE FROM cat_prod WHERE id_prod = " + idProd);
            // console.log(sqlRemove);
            connection.query(sqlRemove, function(erro, result){
                if(erro){
                    callback(1,0);
                    return acess = false;
                }
            })
            return connection.query("select 1");
        }

        return connection.query("Select 1");
    }).then(function(){
        // console.log("ACESS:",acess);
        if(acess == false){
            callback(1,0);
            return connection.end();
        }else{
            var sqlRemove = ("DELETE FROM inc_prod WHERE id_prod = " + idProd);

            connection.query(sqlRemove, function(erro, result){
                if(erro){
                    callback(1,0);
                    return acess = false;
                }
            })
            // console.log(sqlRemove);
            return connection.query("select 1");
        }

        return connection.query("Select 1");
    }).then(function(){
        // console.log("ACESS:",acess);
        if(acess == false){
            callback(1,0);
            return connection.end();
        }else{
            var sqlGet = ("SELECT home_id FROM home_prod WHERE prod_id = " + idProd);
            // console.log(sqlGet);
            connection.query(sqlGet, function(erro, result){
                // console.log(result);
                if(erro || result[0] == undefined){
                    // console.log(chalk.yellow("PRODUTO NÃO POSSUI IMAGEM HOME"));
                    return acess = false;
                }else{
                    idImg = result[0].home_id;
                    
                    connection.query("DELETE FROM home_prod WHERE prod_id = "+ idProd, function(erro,result){
                        if(erro){
                            console.log("DELETAR HOME_PROD",erro);
                        }
                    });

                    return idImg;
                }
            });
            return connection.query("select 1");
        }

        return connection.query("Select 1");
    }).then(function(){
        // console.log("ACESS:",acess);
        if(acess == false){
            idImg = undefined;
        }else{
            var sqlGet = ("SELECT name_img FROM images_home WHERE home_id = "+ idImg);
            
            connection.query(sqlGet, function(erro, result){
                // console.log(result);
                if(erro){
                    callback(1,0);
                    return acess = false;
                }else{
                    nameHome = result[0].name_img;
                    var sqlRemove = ("DELETE FROM images_home WHERE home_id = "+ idImg);
                    connection.query(sqlRemove,function(erro){
                        if(erro){
                            return acess = false;
                        }else{
                            console.log('entrou aqui');
                            removeThis(nameHome,'1');
                        }
                        return connection.query("select 1");
                    });
                    return connection.query("select 1");
                }
            })
        }

        return connection.query("Select 1");
    }).then(function(){
        // console.log("ACESS:",acess);

        var sqlGet = ("SELECT det_id FROM det_prod WHERE prod_id = " + idProd);
        // console.log(sqlGet);
        connection.query(sqlGet, function(erro, result){
            // console.log(result);
            if(erro || result[0] == undefined){
                // console.log(chalk.yellow("PRODUTO N POSSUI IMAGENS DETALHADAS"));
                return acess = false;
            }else{
                for(var i = 0; i < result.length; i++ ){
                    idDet.push(result[i].det_id);
                }
                connection.query("DELETE FROM det_prod WHERE prod_id = "+ idProd, function(erro,result){
                    if(erro){
                        console.log("DELETAR DET_PROD",erro);
                    }
                });
                return idDet;
            }
        });

        return connection.query("Select 1");
    }).then(function(){
        // console.log("ACESS:",acess);
        if(acess == false){
            idDet = undefined;
        }else{
            var sqlGet = ("SELECT name_img FROM images_det WHERE det_id in ("+idDet+")");
            // console.log(sqlGet);
            nameDet = [];
            connection.query(sqlGet, function(erro, result){
                // console.log(result);
                if(erro){
                    callback(1,0);
                    return acess = false;
                }else{
                    // console.log(result);
                    if( result != undefined ){
                        //console.log("ENTROU IF", result);
                        for(var i = 0; i < result.length; i++){
                            nameDet.push(result[i].name_img);
                        }
                        return nameDet;
                    }
                }
            });
            return connection.query("SELECT 1");
        }
        return connection.query("SELECT 1");
    }).then(function(){
        // console.log("ACESS:",acess);
        if(acess == false){
            idDet = undefined;
        }else{
            var sqlRemove = ("DELETE FROM images_det WHERE det_id in ("+ idDet +")");
            // console.log(sqlRemove);
            connection.query(sqlRemove,function(erro){
                if(erro){
                    callback(1,0);
                    return acess = false;
                }
            });
        }
        return connection.query("SELECT 1");
    }).then(function(){
        if(acess == false){
            nameDet = undefined;
        }else{
            console.log("IMAGE HOME", nameHome);
            // function deleteThis(file){
            //     console.log(chalk.blue("AQUI"),file);
            //     fs.unlink(file,function(err){
            //         if (err) throw err;
            //         console.log(chalk.red(file," - DELETADA"));
            //     });

            //     return true;
            // }
    
            if(nameDet != undefined){
                for(var i = 0; i < nameDet.length; i++){
                    removeThis(nameDet[i], '2');
                }
                callback(0,1);
                return connection.query("SELECT 1");
            }
        }  
        
        callback(0,1);
        return connection.end();
    });
}

Anuncio.prototype.desativarAnuncio = function(id, status, callback){

    db.then(function(conn){
        connection = conn;

        // console.log(id, status);

        if( status == 'true' ){
            var turnOFF = false;
            var sqlDest = ("UPDATE produto SET ativo_prod = " + turnOFF + " WHERE id_prod = " + id );

        }else {
            var turnON = true;
            var sqlDest = ("UPDATE produto SET ativo_prod = " + turnON + " WHERE id_prod = " + id );
        }

        // console.log(sqlDest);
        connection.query(sqlDest,function(err, result){
            // console.log(result);
            if(err){
                callback(1, 0);
            }
            else{
                callback(0, 1);
            }
        });

        connection.end();

    })

}

module.exports = Anuncio;
