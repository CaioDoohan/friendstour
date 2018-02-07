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
        
        conn.query('select * from categoria order by id_cat asc', callback);

        // conn.end();
    })
}

Anuncio.prototype.getInclusos = function(callback){
    db.then(function(conn){
        
        conn.query('select * from inclusos order by id_inc asc', callback);

        // conn.end();
    })
}

Anuncio.prototype.addAnuncio = function(dadosForm,imgHome,imgDet, callback){
    var confirmacao;
    var idProd;
    var idHome;
    
    db.then(function(conn){
        var insert = "INSERT INTO produto(nome_prod,desc_prod,data_prod,valor_prod,nacional_prod,vagas_prod,parcelas_prod,texto_prod) VALUES(?,?,?,?,?,?,?,?)";
        
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
        ];

        connection.query(insert,tabProd,callback);
        console.log(chalk.red("--DADOS CADASTRADOS--"));
        
    }).then(function(erro){
        // console.log(dadosForm);
        var getId = ("select id_prod from produto where nome_prod = '" + dadosForm.nome_prod + "' order by 1 desc limit 1");

        // console.log(chalk.yellow(getId));

        return connection.query(getId);

    }).then(function(userID){

        console.log(chalk.blue(userID));

        id = userID[0].id_prod;
        
        for(var k = 0; k < dadosForm.incluso.length; k++){
            var sqlInc = "insert into inc_prod(id_inc,id_prod) values("+ dadosForm.incluso[k] + "," + id + ")";
            // console.log(dados.incluso[k] + '---' + id);
            connection.query(sqlInc);
        }

        // console.log(chalk.blue(sqlInc));

        return id;

    }).then(function(id){

        for(var k = 0; k < dadosForm.categoria.length; k++){
            var sqlCat = "insert into cat_prod(id_cat,id_prod) values("+ dadosForm.categoria[k] + "," + id + ")";
            // console.log(chalk.green(dados.categoria[k] + '---' + id));
            connection.query(sqlCat);
        }

        return id;
        // console.log(chalk.yellow("PRODUTO ADICIONADO"));
    }).then(function(id){
        idProd = id;
        
        var homePath = imgHome.home;

        var sqlHome = ("INSERT INTO images_home(name_img) VALUE('" + homePath +"') " );

        return connection.query(sqlHome,homePath);

    }).then(function(result){
        var idHome = result.insertId;

        var sqlHome = ("INSERT INTO home_prod(home_id,prod_id) VALUES("+ idHome + ","+ idProd + ")");

        connection.query(sqlHome);

    }).then(function(){

        var detPaths = imgDet;
        var that = this;
        var idsDet = [];

        for(var i =0; i < detPaths.length; i++){
            var sqlDet = ("INSERT INTO images_det(name_img) VALUE('" + detPaths[i] + "')");

            connection.query(sqlDet, function(err,result){      
                if(err){
                    throw err
                }else{
                    teste(result.insertId);
                    console.log(arrIdsDet);
                }
            });
        }

        return connection.end();
    }).then(function(){
        console.log('ARRAY:',arrIdsDet); 

        for(var i=0; i < arrIdsDet.length; i++){

            var sqlInsert = ("INSERT INTO det_prod(det_id, prod_id) VALUES("+ arrIdsDet[i] +","+ idProd +")");

            connection.query(sqlInsert);  

        }
       
        connection.end();

    });
}

function teste(arrGambi){
    arrIdsDet.push(arrGambi);
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
    // console.log(dadosEdit);
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
            valor_prod : dadosEdit.valor_prod,
            parcelas_prod : dadosEdit.parcelas_prod,
            vagas_prod : (dadosEdit.vagas_prod == "on" ? true : false),
            texto_prod : dadosEdit.texto_prod
        }

        // console.log(prod);
        var sqlUpdate = ("UPDATE produto SET ? where id_prod = " + prod.id_prod);
        
        
        connection.query(sqlUpdate,prod);
        console.log('Works');
    }).then(function(){

        id = dadosEdit.id_prod;

        var removeCat = ("DELETE FROM cat_prod WHERE id_prod = " + id);
        var upCat = ("INSERT into cat_prod SET ? ");
        
        connection.query(removeCat);
        console.log(chalk.yellow("Categorias retiradas"));

        for(var i = 0; i < dadosEdit.categoria.length; i++){
            
            catIds.push({
                id_cat : dadosEdit.categoria[i],
                id_prod : dadosEdit.id_prod
            })
            connection.query(upCat, catIds[i]);
        }
        
        console.log(chalk.yellow("Categorias adicionadas"));

    }).then(function(){
        id = dadosEdit.id_prod;
        
        var removeInc = ("DELETE FROM inc_prod WHERE id_prod = " + id);
        var upInc = ("INSERT into inc_prod SET ? ");
        
        connection.query(removeInc);
        console.log(chalk.yellow("Inclusos retirados"));

        for(var i = 0; i < dadosEdit.incluso.length; i++){
            
            incIds.push({
                id_inc : dadosEdit.incluso[i],
                id_prod : dadosEdit.id_prod
            })
            connection.query(upInc, incIds[i]);
        }
        
        console.log(chalk.yellow("Inclusos adicionados"));


        prodAlterado = {
            id_prod : prod.id_prod,
            nome_prod : prod.nome_prod,
            desc_prod : prod.desc_prod,
            dia_prod : moment(prod.data_prod).format('YYYY/MM/DD'),
            hora_prod : moment(prod.data_prod).format('HH:mm:ss'),
            nacional_prod : prod.nacional_prod,
            valor_prod : prod.valor_prod,
            parcelas_prod : prod.parcelas_prod,
            vagas_prod : prod.vagas_prod,
            texto_prod : prod.texto_prod,
            categoria : catIds,
            inclusos : incIds,
        }
        console.log(prodAlterado);

        alteracao(0, prodAlterado);
    });
}

Anuncio.prototype.removeAnuncio = function(id, callback){
    var idProd;
    db.then(function(conn){
        connection = conn;
        idProd = id;

        var sqlRemove = ("DELETE FROM produto WHERE id_prod = " + idProd);
        
        connection.query(sqlRemove);

        return callback(0,0);
    });
}

module.exports = Anuncio;