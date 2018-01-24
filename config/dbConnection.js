// var database = require('mysql');
// var database = require('promise-mysql');
exports.mysqlOptions = {
                host: 'localhost',
                user: 'root',
                password: 'm10d12',
                database: 'friendsdb',
                typeCast: function castField( field, useDefaultTypeCasting ) {
                    
                    if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
                        var bytes = field.buffer();
                        return( bytes[ 0 ] === 1 );
                    }
                    return( useDefaultTypeCasting() );
                }
            };

// module.exports = con;
