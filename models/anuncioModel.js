module.exports = function(){

    this.getAnuncio = function(con, callback){
        con.query('select * from teste', callback);
    }

    this.salvarNoticia = function(dadosFormulario, con, callback){
        console.log('entrou 2');
        try{
            con.query("insert into testeForm set ?", dadosFormulario, callback);
        }catch(err){
            console.error('ERROR CAIO',err);
        }        
    }

    return this;
}


//(nome) values('"+dadosFormulario.nome+"')