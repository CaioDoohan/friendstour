var db = require('../config/dbConnection.js');

var ContatoDAO = function(){
    this._con = new db();
}

ContatoDAO.prototype.salvarAnuncio = function(dadosFormulario,callback){
    var sql = "INSERT INTO testeform(nome,telefone,email,redesocial,mensagem) VALUES(?,?,?,?,?)";

    var param = [
        dadosFormulario.nome,
        dadosFormulario.telefone,
        dadosFormulario.email,
        dadosFormulario.redesocial,
        dadosFormulario.mensagem
    ];
    
    this._con.query(sql, param,callback);
    console.log("----Dados Cadastrados----");
    this._con.end();
}

module.exports = ContatoDAO;