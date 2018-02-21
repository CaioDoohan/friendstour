exports.mysqlOptions = {
                host: 'mysql937.umbler.com',
                port: 3000,
                user: 'friends',
                password: 'minhamae2311',
                database: 'friendstourdb',
                socketPath: false,
                connectionLimit: 5,
                typeCast: function castField( field, useDefaultTypeCasting ) {
                    
                    if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
                        var bytes = field.buffer();
                        return( bytes[ 0 ] === 1 );
                    }
                    return( useDefaultTypeCasting() );
                }
            };


