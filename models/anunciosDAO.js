var db = require('../config/dbConnection.js');

var Anuncio = function(){
    this._con = new db();
}
 
Anuncio.prototype.getAllAnuncio = function(callback){
    this._con.query('select * from categoria', callback);
    
    this._con.end();
}

Anuncio.prototype.getCategoria = function(callback){
    this._con.query('select * from categoria order by id_categoria asc', callback);
}

Anuncio.prototype.getTipo = function(callback){
    this._con.query('select * from tipagem order by id_tipagem asc', callback);
}

Anuncio.prototype.addAnuncio = function(dados, callback){
    
    var sql =
    "INSERT INTO anuncio(id_categoria,id_tipagem,nome,cidade,destino,horario,data,saida,valor,formpag) VALUES(?,?,?,?,?,?,?,?,?,?)";
    // ,cidade,destino,horario,data,saida,valor,formpag
    var param = [
        dados.id_categoria,
        dados.id_tipagem,
        dados.nome,
        dados.cidade,
        dados.destino,
        dados.horario,
        dados.data,
        dados.saida,
        dados.valor,
        dados.formpag   
    ];
    // console.log(param);
    console.log(param);
    this._con.query(sql, param,callback);
    
    console.log("----Dados Cadastrados----");
    this._con.end();
}


module.exports = Anuncio;