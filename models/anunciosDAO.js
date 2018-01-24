var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var db;
var connection;

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

        conn.end();
    })
}

Anuncio.prototype.addAnuncio = function(dados, callback){
    db.then(function(conn){
        var insert = "INSERT INTO produto(nome_prod,desc_prod,data_prod,valor_prod,nacional_prod,vagas_prod,parcelas_prod,texto_prod) VALUES(?,?,?,?,?,?,?,?)";
        connection = conn;
        var tabProd = [
            dados.nome_prod,
            dados.desc_prod,
            dados.data_prod,
            dados.valor_prod,
            (dados.nacional_prod == "on" ? true : false),
            (dados.vagas_prod == "on" ? true : false),
            dados.parcelas_prod,
            dados.texto_prod,
        ]
        console.log(chalk.red("--DADOS CADASTRADOS--"));
        connection.query(insert,tabProd,callback);
        
    }).then(function(erro){
        console.log(dados);
        var getId = ("select id_prod from produto where nome_prod = '" + dados.nome_prod + "'order by 1 desc limit 1");

        // console.log(chalk.yellow(getId));

        return connection.query(getId);

    }).then(function(userID){

        id = userID[0].id_prod;
        
        for(var k = 0; k < dados.incluso.length; k++){
            var sqlInc = "insert into inc_prod(id_inc,id_prod) values("+ dados.incluso[k] + "," + id + ")";
            // console.log(dados.incluso[k] + '---' + id);
            connection.query(sqlInc);
        }

        // console.log(chalk.blue(sqlInc));

        return id;

    }).then(function(id){

        for(var k = 0; k < dados.categoria.length; k++){
            var sqlCat = "insert into cat_prod(id_cat,id_prod) values("+ dados.categoria[k] + "," + id + ")";
            // console.log(chalk.green(dados.categoria[k] + '---' + id));
            connection.query(sqlCat);
        }
        // console.log(chalk.blue(sqlCat));
        connection.end();
        console.log(chalk.yellow("PRODUTO ADICIONADO"));
    });
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

        var sqlCat = ("select id_cat from cat_prod where id_prod =" + idProd);
        
        return connection.query(sqlCat);

    }).then(function(cat){

        for(var i = 0; i < cat.length; i++){

            categoria.push({
                id_cat : cat[i].id_cat
            });

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

Anuncio.prototype.editAnuncio = function(dadosAlter, alteracao){
    console.log(dadosAlter);
    var prod = {},
        catIds = [],
        incIds = [],
        prodAlterado = {};
    db.then(function(conn){

        connection = conn;

        prod = {
            id_prod : dadosAlter.id_prod,
            nome_prod : dadosAlter.nome_prod,
            desc_prod : dadosAlter.desc_prod,
            data_prod : dadosAlter.data_prod,
            nacional_prod : dadosAlter.nacional_prod,
            valor_prod : dadosAlter.valor_prod,
            parcelas_prod : dadosAlter.parcelas_prod,
            vagas_prod : dadosAlter.vagas_prod,
            texto_prod : dadosAlter.texto_prod
        }


        var sqlUpdate = ("UPDATE produto SET ? where id_prod=" + prod.id_prod);
        
        connection.query(sqlUpdate, prod);
    })
}
module.exports = Anuncio;