var mysql = require('promise-mysql');
var config = require('../config/dbConnection');
var db;
var connection;

var DetalhesDAO = function(){
    db = mysql.createConnection(config.mysqlOptions);
}
 
DetalhesDAO.prototype.getId = function(id,callback){
   // var idsProd = new Array();
    //var produtos = new Array();
    var inc = new Array();
    var cat = new Array();
    var idProd = id;
    var imgDet = new Array();
    db.then(function(conn){
        connection = conn;
        var options = "nome_prod, TRIM(desc_prod) AS desc_prod, data_prod, valor_prod, parcelas_prod, TRIM(texto_prod) AS texto_prod";
        
        var sqlGet = ("select "+ options +" from produto WHERE id_prod = "+ idProd);
        // console.log(sqlGet);
        return connection.query(sqlGet);
        //return connection.query("SELECT 1");
    })
    .then(function(result){
        // console.log(result[0]);
        produto = result[0];

        return connection.query("select CP.id_prod,C.nome_cat from cat_prod as CP Inner join categoria as C on C.id_cat = CP.id_cat where id_prod in (" + idProd + " )");
    })
    .then(function(categorias){
        
        for(var i = 0; i < categorias.length; i++){
            cat.push(categorias[i].nome_cat);
        }
        //console.log(cat);

        return connection.query("select IP.id_prod, I.nome_inc from inc_prod as IP Inner join inclusos as I on I.id_inc = IP.id_inc where id_prod in (" + idProd + " )");
    })
    .then(function(inclusos){

        for(var i = 0; i < inclusos.length; i++){
            inc.push(inclusos[i].nome_inc);
        }
        //console.log(inclusos);

        return connection.query("select DP.prod_id, D.name_img from det_prod as DP Inner join images_det as D on D.det_id = DP.det_id where prod_id in (" + idProd + " ) and ativo_prod = b'1'");
        
    })
    .then(function(det){
        
        if( det.length > 0 && det != undefined){
            //console.log("ENTROU DIFERENTE");
            for(var i = 0; i < det.length; i++){
                imgDet.push(det[i].name_img);
            }
        }else{
            //console.log("ENTROU UNDEFINED");
            imgDet = undefined;
        }
        
        //console.log("CATEGORIAS", cat);
        //console.log("INCLUSOS", inc);
        //console.log("IMAGES DET", imgDet);

        prodFinal = {
            nome_prod: produto.nome_prod,
            desc_prod : produto.desc_prod,
            data_prod: produto.data_prod,
            valor_prod : produto.valor_prod,
            parcelas_prod : produto.parcelas_prod,
            texto_prod : produto.texto_prod,
            categoria : cat,
            inclusos : inc,
            imagem   : imgDet
        }
        //console.log(prodFinal);
        callback(0,prodFinal);
        return connection.end();
    });
}

module.exports = DetalhesDAO;

