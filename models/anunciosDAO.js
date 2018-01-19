var db = require('../config/dbConnection.js');
var moment = require('moment');

var Anuncio = function(){
    this._con = new db();
}
 
Anuncio.prototype.getAllAnuncio = function(callback){
    this._con.query('select * from produto order by datacriacao_prod', callback);
    
    this._con.end();
}

Anuncio.prototype.getCategoria = function(callback){
    this._con.query('select * from categoria order by id_cat asc', callback);
}

Anuncio.prototype.getInclusos = function(callback){
    this._con.query('select * from inclusos order by id_inc asc', callback);
}

Anuncio.prototype.addAnuncio = function(dados, callback){

    var insert = "INSERT INTO produto() VALUES(?)";

    var tabProd = {
        nome_prod : dados.nome_prod,
        desc_prod : dados.desc_prod,
        data_prod : moment(dados.data_prod, "YYYY-MM-DD THH:mm:ss", true).isValid(),
        valor_prod : dados.valor_prod,
        tipo_prod : dados.tipo_prod,
        vagas_prod : dados.vagas_prod,
        parcelas_prod : dados.parcelas_prod
    }

    for(var v = 0; v < dados.categoria.length; v++){

        var sqlCat = "insert into cat_prod(id_cat) values(" + dados.categoria[v] + ")";
       
        this._con.query(sqlCat,callback);
    }
    var deletInc = "DELETE FROM inc_prod WHERE id_prod =" + dados.id_prod ;

    console.log("----Dados Cadastrados----");
    this._con.end();
}


module.exports = Anuncio;