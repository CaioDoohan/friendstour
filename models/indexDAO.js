var db = require('../config/dbConnection.js');

var Event = function(){
    this._con = new db();
}

Event.prototype.getAnuncio = function(callback){

    console.log("--DB:ON--");

    this._con.query('select * from produto order by datacriacao_prod desc', callback);
    
    console.log("--DB:OFF--");

    this._con.end();
}

module.exports = Event;