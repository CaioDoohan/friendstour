var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var db;
var connection;

var Event = function(){
    db = mysql.createConnection(config.mysqlOptions);
}

Event.prototype.getAnuncios = function(result){
    var prod = [];
    var cat = [];
    var idProd = [];
    db.then(function(conn){
        connection = conn;
        return connection.query('select * from produto order by datacriacao_prod desc limit 5');
    })
    .then(function(produtos){
        var ids = [];
        // console.log(produtos)
        for( var i = 0; i < produtos.length; i++){
           
            ids.push(produtos[i].id_prod)
        }
        prod = produtos;
        idProd = ids;
        return connection.query("select CP.id_prod,C.nome_cat from cat_prod as CP Inner join categoria as C on C.id_cat = CP.id_cat where id_prod in (" + ids + " )");
        
    })
    .then(function(categorias){
        cat = categorias;
        // console.log(categorias);
        return connection.query("select IP.id_prod, I.nome_inc from inc_prod as IP Inner join inclusos as I on I.id_inc = IP.id_inc where id_prod in (" + idProd + " )");
    })
    .then(function(inclusos){
        inc = inclusos;
        var prodFinal = [];
        for( var i = 0; i < prod.length; i++){
            var catF = [];
            var incF = [];
            for(var k = 0; k < cat.length; k++){
                if(cat[k].id_prod ==  prod[i].id_prod ){
                    catF.push(cat[k].nome_cat);
                }
                // console.log(catF);
            }

            for(var b = 0; b < inc.length; b++){
                if(inc[b].id_prod ==  prod[i].id_prod ){
                    incF.push(inc[b].nome_inc);
                }
            }

            prodFinal.push( {
                id_prod : prod[i].id_prod,
                nome_prod: prod[i].nome_prod,
                desc_prod : prod[i].desc_prod,
                data_prod: prod[i].data_prod,
                valor_prod : prod[i].valor_prod,
                parcelas_prod : prod[i].parcelas_prod,
                texto_prod : prod[i].texto_prod,
                ativo_prod : prod[i].ativo_prod,
                vagas_prod : prod[i].vagas_prod,
                categoria : catF,
                inclusos : incF,
            });
            // console.log(prodFinal.categoria);
        }

       result(0,prodFinal);
    })
}

module.exports = Event;
