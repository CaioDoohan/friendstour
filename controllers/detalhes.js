var express      = require('express')
var router       = express.Router();
var moment       = require('moment');
var nodemailer   = require('nodemailer');
var DetalhesDAO  = require('../models/DetalhesDAO.js');

router.get('/:id', function(req, res, next) {
    // console.log("-----------------Entrou--------------")
    var id = req.params.id;
    console.log('ID:', id);
    var Detalhes = new DetalhesDAO(null);

    Detalhes.getId( id , function(erro, result){

        var prod = result.length > 0 ? result[0] : undefined;
        var param;

        if(prod != undefined){

            param = {
                id_prod : prod.id_prod,
                nome_prod : prod.nome_prod,
                desc_prod : prod.desc_prod,
                horario : prod.horario = moment(prod.data_prod).format('HH:mm'),
                data : prod.data = moment(prod.data_prod).format('DD/MM'),
                valor_prod : prod.valor_prod,
                parcelas_prod : prod.parcelas_prod,
                texto_prod : prod.texto_prod,
                
            }
        }
        // console.log('RESULT QUERY:', param);     
        res.render('detalhes', { title: 'Friendstour - Detalhes', produto : param});
    });
});

router.post('/email', function(req, res, next){

    console.log(req.body);

    var output = `

    <p>Teste email</p>
    <ul>
     <li>Nome : ${req.body.nome}</li>
     <li>Telefone : ${req.body.telefone}</li>
     <li>Email : ${req.body.email}</li>
     <li>Data de Nascimento : ${req.body.nascimento}</li>
     <li>RG : ${req.body.rg}</li>
     <li>CPF : ${req.body.cpf}</li>
     <li>Mensagem : ${req.body.mensagem}</li>
    </ul>
    
    `;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'pereiradoohan@gmail.com',
               pass: 'Manuela@2016'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Friends Tour - Reserva" <pereiradoohan@outlook.com>', // sender address
        to: 'pereiradoohan@gmail.com', // list of receivers
        subject: 'Friends Tour - Reserva ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });


    res.render("detalhes", { title : 'Detalhes' , produto : { } });

});



module.exports = router;