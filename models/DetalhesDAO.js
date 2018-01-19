var db = require('../config/dbConnection.js');

var DetalhesDAO = function(){
    this._con = new db();
}
 
DetalhesDAO.prototype.getId = function(id,callback){
    console.log(id);
    this._con.query('select * from produto where id_prod = ' + id, callback);

    this._con.end();
}

module.exports = DetalhesDAO;

