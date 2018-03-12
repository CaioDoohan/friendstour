var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var chalk = require('chalk');
var db;
var connection;
var produtos;

var Event = function(){
    db = mysql.createConnection(config.mysqlOptions);
}

Event.prototype.getAnuncios = function(thatX,result){
    var idsProd = new Array();
    var produtos = new Array();
    var inc = new Array();
    var cat = new Array();
    var idProd = new Array();
    var imgHome = new Array();
    // console.log('thatX----',thatX);
    function isEmptyObject(obj) {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
    if (isEmptyObject(thatX)) {
        thatX = {
            statment : "WHERE ativo_prod = b'1' order by datacriacao_prod desc LIMIT 5",
            statmentCat : '',
            notEnd : true
        }
    } else {
        ( thatX.statment != undefined ? (thatX.statmentCat = '' ) : (thatX.statment = "WHERE ativo_prod = b'1' order by datacriacao_prod desc LIMIT 10"));
    }
    
    db.then(function(conn){

        connection = conn;
        var options = "id_prod, nome_prod, desc_prod, data_prod, valor_prod, vagas_prod, parcelas_prod,promo_prod, nacional_prod";

        var sqlGet = ("select "+ options +" from produto "+ thatX.statment);
        // console.log("QUERY 1",sqlGet);
        connection.query(sqlGet, function(erro,something){
            //console.log("RESULTADO -> :",something);
            //console.log("erro:",erro);
            if(something[0] == undefined){
                produtos = undefined;
                result(1, produtos);
                return connection.end();
            }
            else{
                produtos = something;
            }
        });
        return connection.query("SELECT 1");
    })
    .then(function(){

        if(produtos != undefined ){
            for( var i = 0; i < produtos.length; i++){
                idsProd.push(produtos[i].id_prod)
            }
        }

        var sqlGet = ("select CP.id_prod,C.nome_cat from cat_prod as CP Inner join categoria as C on C.id_cat = CP.id_cat where id_prod in (" +idsProd+") "+ thatX.statmentCat);

        return connection.query(sqlGet);
    
    }).then(function(categorias){
        console.log(categorias);
        if( categorias.length > 0){
            cat = categorias;
        }else{
            produtos = undefined;
            result(1, produtos);
            return connection.end();
        }
        
        // console.log("PRODUTO QUE POSSUI CATEGORIA EXCURSAO:",cat);

        return connection.query("select IP.id_prod, I.nome_inc from inc_prod as IP Inner join inclusos as I on I.id_inc = IP.id_inc where id_prod in (" + idsProd + " )");
    })
    .then(function(inclusos){
        inc = inclusos;
        //console.log(inclusos);

        return connection.query("select HP.prod_id, H.name_img from home_prod as HP Inner join images_home as H on H.home_id = HP.home_id where prod_id in (" + idsProd + " )")
        
    }).then(function(home){

        imgHome = home;
        var prodFinal = [];

        //console.log("CATEGORIAS", cat);
        //console.log("INCLUSOS", inc);
        //console.log("IMAGES HOME", imgHome);

        for( var i = 0; i < produtos.length; i++){

            var id = produtos[i].id_prod;
            var catF = [];
            var incF = [];
            var imgF;

            console.log(chalk.blue("CICLO ID:", id));

            for(var k = 0; k < cat.length; k++){

                //var idcat = cat[k].id_prod;
                if( cat[k].id_prod == id ){
                    //console.log("CATEGORIA DE PRODUTO - CAT_PROD IGUAL:",cat[k].id_prod, id );
                    catF.push(cat[k].nome_cat);
                }
            }

            //console.log("CATEGORIA DO ID:", catF);

            for ( var b = 0; b < inc.length; b++){

                //var idinc = inc[b].id_prod;
                if( inc[b].id_prod == id ){
                    //console.log("ID INC_PROD:" + inc[b].id_prod + "/ID PROD:" + id);
                    //console.log("IGUAL",idinc, id );
                    incF.push(inc[b].nome_inc);
                }

            }
            //console.log("INCLUSO DO ID:", incF);

            for( var c = 0; c < imgHome.length; c++ ){
                //console.log("IMAGEM ID:" + imgHome[c].prod_id + "/ID PROD:" + id);
                if(imgHome[c].prod_id == id){
                    //console.log(chalk.green("IGUALZIN PAINHO"));
                    //console.log(imgHome[c].name_img);
                    imgF = imgHome[c].name_img;
                }else if(imgHome[c] == undefined){
                   // console.log(chalk.green("É UNDEFINED PAINHO"));
                    imgF = undefined;
                }
            }

            //console.log("IMAGEM DO ID:", imgF);
            console.log(catF.length > 0 ? true : false);
            if( catF.length > 0 ){
                prodFinal.push( {
                    id_prod : produtos[i].id_prod,
                    nome_prod: produtos[i].nome_prod,
                    desc_prod : unescape(produtos[i].desc_prod).trim(),
                    data_prod: produtos[i].data_prod,
                    valor_prod : produtos[i].valor_prod,
                    parcelas_prod : produtos[i].parcelas_prod,
                    nacional_prod : produtos[i].nacional_prod,
                    vagas_prod : produtos[i].vagas_prod,
                    promo_prod : produtos[i].promo_prod,
                    categoria : catF,
                    inclusos : incF,
                    imagem   : imgF
                });
            }
            
        }

        result(0,prodFinal);
        console.log("FINAL:",prodFinal);
       if(thatX.notEnd != true){
           //console.log("CONNECTION FECHADA");
           return connection.end();
       }
    });
}

Event.prototype.getBanners = function(banners){
    db.then(function(conn){
        connection = conn;

        var options = "banner"
        var sqlGet = ("SELECT "+ options + " from banners WHERE ativo_banner =  b'1' order by data_criacao LIMIT 3");

        connection.query(sqlGet, function(erro, result){
            console.log(result);
            if(erro || result[0] == undefined){
                banners(undefined);
            }else{
                banners(result);
            }
        })

        connection.end();
    })
}

module.exports = Event;
