var express = require('express');
var router = express.Router();
var Imagem = require('../models/imagensDAO');
const multer = require('multer');
var moment = require('moment');
var chalk = require('chalk');

// IMAGEM ÚNICA

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/uploads/prods/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'-'+ file.originalname);
    }
});

var upload = multer({storage : storage});

var cpUpload = upload.fields([{ name: 'imghome', maxCount: 1 }, { name: 'imgdet', maxCount: 4 }]);

//-----------------------------

router.get('/', function(req, res, next) {
    
    var ImagemModel = new Imagem();

    ImagemModel.getAllAnuncio(function(erro, result){

        for(var i=0 ; i < result.length; i++){

            result[i].nome_prod;
            result[i].datacriacao_prod = moment(result[i].datacriacao_prod).format('DD/MM/YYYY');
            result[i].ativo_prod;
        }
        res.render('admin/anunciosIMG', { title: 'Friendstour - Gerenciamento de Imagens', produto : result});
    });

});

router.get('/adicionar-:id', function(req,res,next){

    var id_prod = req.params.id;
    var dados = {
        id_prod : id_prod
    };
    
    res.render('admin/adicionarIMG', { title : 'Friendstour - Adicionar Imagem', dados : dados });

});

router.post('/envio', function(req,res,next){

    var ImagemModel = new Imagem();
    
    cpUpload(req,res,function(err) {
        
        if(err) {
            return res.end("Erro no upload.");
        }
        var dado = req.body;

        console.log('x', req.body.nomefantasia);

        var dados = {
            id_prod : dado.id_prod,
        };
        
        var home_img = req.files.imghome[0];

        var home = {
            name_img : home_img.filename,
        }

        var det_img = req.files.imgdet;

        var det = [];

        for(var i=0; i < det_img.length; i++){
            
            det.push({
                name_img : det_img[i].filename,
            });

        }

        var object = {

            id_prod : dados.id_prod,

            home_img : home.name_img,

            det_img : det,

        }

        // ImagemModel.insertImages(object, function(erro, result){

        //     res.render('admin/adicionarIMG',{ title : 'Friendstour - Imagem adicionada', dados : dados});

        // });
    }); 
});

module.exports = router;

