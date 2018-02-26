var express  = require('express')
var router   = express.Router();
var moment   = require('moment');
var chalk    = require('chalk');
var Banners  = require("../models/bannersDAO.js");
const multer = require('multer');
var validator = require('express-validator');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/uploads/banners/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'-'+ file.originalname);
    }
});

var upload = multer({storage : storage});

var cpUpload = upload.fields([{ name: 'banner', maxCount: 1 }]);

router.get('/', function(req, res, next) {
    var BannersModel = new Banners();

    BannersModel.getAllBanners(function(err, result){
        //console.log("BANNERS", result);
        if(err == 1 || result == undefined){
            res.render("admin/banners", { title : 'Friendstour - Banners', banners : undefined });
        }else{
            //console.log(result);
            for(var i=0 ; i < result.length; i++){
                result[i].banner_id;
                result[i].nome_prod;
                result[i].data_criacao = moment(result[i].data_criacao).format('DD/MM/YYYY');
                result[i].ativo_banner;

            }
            res.render('admin/banners', { title: 'Friendstour - Banners', banners : result });
        }
    });

});

router.get('/adicionar',function(req,res){
    res.render('admin/adicionarBanner', { title : 'Friendstour - Adicionar Banner' , msg : {} });
});

router.post('/adicionar/dados_enviados', function(req,res){

    cpUpload(req,res,function(err) {
        var banner;
        //console.log("1-)BANNER:", banner)
        if( req.files != null && req.files != undefined ){
            banner = req.files.banner[0].filename;
        }

        var BannersModel = new Banners();
        //console.log("2-)BANNER:", banner)
        BannersModel.addBanner(banner, function(erro,result){
            var msg;
            //console.log("2-)Result:", result);
            if(erro == 1){
                msg = erro;
            }
            else{
                msg = 0;
            }
            //console.log("1-)Mensagem:", msg);
            res.render("admin/adicionarBanner", { title : "Friendstour - Adicionar Banner", msg : msg })
        });
    });
    
});

router.post('/remover', function(req,res,next){

    var id = req.body.id;
    var name = req.body.name;
    var BannersModel = new Banners();

    BannersModel.removeBanner(id,name, function(erro, callback){
        if( erro == 1 || callback == undefined){
            res.json({ 
                msg : "ERRO: repita a operação"
             })
        }else{
            res.json({
                msg : "Produto removido"
            })
        }
    });
});

router.post('/desativar', function(req,res){
    var id = req.body.id;
    var status = req.body.turn;
    
    console.log(id);
    console.log(status);

    var BannersModel = new Banners();

    BannersModel.desativarBanner(id,status, function(erro, result){
        if( erro == 1 || result == undefined){
            res.json({ 
                msg : "ERRO: repita a operação"
             })
        }else{
            res.json({
                msg : "Status alterado"
            })
        }

    });

});


module.exports = router;