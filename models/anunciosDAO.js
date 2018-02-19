var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var moment = require('moment');
var db;
var connection;
var arrIdsDet = [];

var Anuncio = function(){
    db = mysql.createConnection(config.mysqlOptions);
}
 
Anuncio.prototype.getAllAnuncio = function(callback){
    db.then(function(conn){
        
        conn.query('select * from produto order by datacriacao_prod', callback);

        // conn.end();
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
            console.log("RESULT", result);
            if(erro){
                return callback(erro, 0);
            }else{
                console.log(result);
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
           // console.log("result!", result);
            if(erro){
                console.log("entrou erro!", result);
                return callback(erro, 0);
            }
            else{
                console.log(chalk.blue("ID DO ANUNCIO:", result.insertId));
                id = result.insertId;
            }
        });

        return connection.query("SELECT 1");
    })/*.then(function(){

        for(var k = 0; k < dadosForm.incluso.length; k++){
            var sqlInc = "insert into inc_prod(id_inc,id_prod) values("+ dadosForm.incluso[k] + "," + id + ")";
            //console.log("INCLUSOS + ID PROD",dadosForm.incluso[k] + '---' + id);
            connection.query(sqlInc);
        }
        
    }).then(function(){

        for(var k = 0; k < dadosForm.categoria.length; k++){
            var sqlCat = "insert into cat_prod(id_cat,id_prod) values("+ dadosForm.categoria[k] + "," + id + ")";
            //console.log(chalk.green("CATEGORIAS + ID PROD", dadosForm.categoria[k] + '---' + id));
            connection.query(sqlCat);
        }
        // console.log(chalk.yellow("PRODUTO ADICIONADO"));
    }).then(function(){
        //idProd = id;
        //console.log(imgHome);
        if(imgHome != undefined ){
            console.log("IMAGEM HOME != undefined");
            var homePath = imgHome.home;

            var sqlHome = ("INSERT INTO images_home(name_img) VALUE('" + homePath +"') " );

            //console.log(sqlHome);

            connection.query(sqlHome, function(erro, result){
                if(erro){
                    callback(erro, 0);
                }else{
                    //console.log(result);
                    idHome = result.insertId;
                }
            });
        }else{
            //console.log("imagem home == NULL");
            idHome = null;
        }
        return connection.query("SELECT 1");

    }).then(function(){
        //console.log("ID IMGAGEM HOME:",idHome);
        if( idHome != null ){
            //console.log("n é null",idHome);
            var sqlHome = ("INSERT INTO home_prod(home_id,prod_id) VALUES("+ idHome + ","+ id + ")");

            connection.query(sqlHome);
        }

        return connection.query("SELECT 1");

    })/*.then(function(){

        var detPaths = detImg;
        var idsDet = [];
        console.log("IMAGES DET:",detImg);
        if( detPaths != undefined ){
            console.log("ENTROU if");
            testeAsync(detPaths);
            console.log("6-)RESULT",arrIdsDet);
            /*for(var i = 0; i < detPaths.length; i++){
                var sqlDet = ("INSERT INTO images_det(name_img) VALUE('" + detPaths[i] + "')");

                console.log(sqlDet);
                connection.query(sqlDet, function(err,result){      
                    if(err){
                        callback(err, 0);
                    }else{
                        
                        var id = result.insertId;
                        function gambiDasBoa(id){
                            arrIdsDet.push(arrGambi);
                        }
                        gambiDasBoa(result.insertId);
                        return arrIdsDet;
                        console.log("array dentro do else:",arrIdsDet);
                    }
                });
                console.log("FORA DA CONNECTION:", arrIdsDet);
            }
            //console.log("FORA DO ELSE", arrIdsDet);
            //return arrIdsDet;
        }else{
            console.log("ARRAY NULL");
            arrIdsDet = null;
        }
        console.log("ARRAY FINAL:",arrIdsDet);
        return connection.query("select 1;")
    }).then(function(){
        console.log('ARRAY:',arrIdsDet); 

        if( arrIdsDet != null ){
            console.log("NAO É NULL");
            for(var i = 0; i < arrIdsDet.length; i++){
                var sqlInsert = ("INSERT INTO det_prod(det_id, prod_id) VALUES("+ arrIdsDet[i] +","+ id +")");
    
                //console.log(sqlInsert);
                connection.query(sqlInsert);
            }
        }
        callback(0,1);

        connection.end();
    });*/
}

/*
async function testeAsync(value){
    console.log("1-)ENTROU FUNCTION");
    for(var i = 0; i < value.length; i++){
        var sqlDet = ("INSERT INTO images_det(name_img) VALUE('" + value[i] + "')");
        console.log("2."+ i +"-)"+ sqlDet);
        await insert(sqlDet);
    }
    console.log("5-)FINAL:",arrIdsDet);
    return await arrIdsDet;
}

function insert(sql){
    connection.query(sql, function(err,result){      
        if(err){
            throw err;
            //callback(err, 0);
        }else{
            var id = result.insertId;
            console.log("3-)",id);
            arrIdsDet.push(id);
            console.log("4-)",arrIdsDet);
            //console.log("array dentro do else:",arrIdsDet);
        }
    });
}
*/
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
                   console.log("Usuario em uso");
                   return validate(0, false);
                }
                else{
                    console.log("Usuario disponível");
                    return validate(0, true); 
                }
            });
            connection.end();
        });

    }else{
        return validate(0, undefined);
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
        console.log(chalk.blue("Preferences: OFF"));

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
    db.then(function(conn){
        connection = conn;
        idProd = id;

        var sqlRemove = ("DELETE FROM produto WHERE id_prod = " + idProd);
        
        connection.query(sqlRemove);

        return callback(0,1);
    });
}

Anuncio.prototype.desativarAnuncio = function(id, status, callback){

    db.then(function(conn){
        connection = conn;

        console.log(id, status);

        if( status == 'true' ){
            var turnOFF = false;
            var sqlDest = ("UPDATE produto SET ativo_prod = " + turnOFF + " WHERE id_prod = " + id );

        }else {
            var turnON = true;
            var sqlDest = ("UPDATE produto SET ativo_prod = " + turnON + " WHERE id_prod = " + id );
        }

        console.log(sqlDest);
        connection.query(sqlDest,function(err, result){
            console.log(result);
            if(err){
                callback(1, 0);
            }
            else{
                callback(0, 1);
            }
        });

    })

}

module.exports = Anuncio;