var database = require('mysql');

var con = function(){
    return database.createConnection({
        host: "localhost",
        user: "root",
        password: "m10d12",
        database: "friendsdb",
    });
}

module.exports = con;