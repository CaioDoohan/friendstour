exports.mysqlOptions = {
                host: 'mysql937.umbler.com',
                port: 41890,
                user: 'friends',
                password: 'minhamae2311',
                database: 'friendstourdb',
                // host: 'localhost',
                // port:3306,
                // user:'root',
                // password:'m10d12',
                // database: 'friendsdb',
                // connectionLimit: 5,
                typeCast: function castField( field, useDefaultTypeCasting ) {
                    
                    if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
                        var bytes = field.buffer();
                        return( bytes[ 0 ] === 1 );
                    }
                    return( useDefaultTypeCasting() );
                }
            };


