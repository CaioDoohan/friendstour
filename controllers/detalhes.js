var express      = require('express')
var router       = express.Router();
var moment       = require('moment');
var nodemailer   = require('nodemailer');
var DetalhesDAO  = require('../models/DetalhesDAO.js');

router.get('/:id', function(req, res, next) {
    // console.log("-----------------Entrou--------------")
    var id = req.params.id;
    var Detalhes = new DetalhesDAO(null);

    Detalhes.getId( id , function(erro, result){
        
        var prod = result != undefined ? result : undefined;
        var param;

        if(prod != undefined){

           param = {
                nome_prod : prod.nome_prod,
                desc_prod : prod.desc_prod,
                horario : prod.horario = moment(prod.data_prod).format('HH:mm'),
                data : prod.data = moment(prod.data_prod).format('DD/MM'),
                valor_prod : prod.valor_prod,
                parcelas_prod : prod.parcelas_prod,
                texto_prod : prod.texto_prod,
                categorias : prod.categoria,
                inclusos : prod.inclusos,
                imagens : prod.imagem
            }
        }
        //console.log('RESULT QUERY:', param);     
        res.render('detalhes', { title: 'Friendstour - Detalhes', produto : param});
    });
});

router.post('/email', function(req, res, next){
    console.log(req.body);
    var erro;
    var confirm;
    var output = `
    <!DOCTYPE html PUBLIC //W3C//DTD XHTML 1.0 Transitional//EN'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
        <html>
            <head>
                <title>Friend's Tour</title>
                <meta http-equiv='Content-Type' content='text/html charset=UTF-8' />
            </head>
            <body>
                <center>
                    <table border="0" cellpadding="0" cellspacing="0" width="750" style="display:table;margin:0 auto;background-color:#253138;border-radius:7px;color:#ffffff;font-family:Arial, Helvetica, sans-serif">
                        <tbody>
                        <tr>
                            <td colspan="3" height="50px"></td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <p style="font-size:25px;color:#f58731;font-weight:bold;text-align:center;margin:0">Friend's Tour - Pedido de Reserva</p>
                            </td>
                        </tr>
                        <tr>
                                <td colspan="3" height="30px"></td>
                            </tr>
                        <tr>
                            <td colspan="3">
                                <p style="font-size:18px;color:#f58731;font-weight:bold;text-align:center;margin:0">
                                    ${req.body.evento}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="100px">
                                
                            </td>
                            <td width="550">
                                    <table  border="0" cellpadding="0" cellspacing="0" width="100%" style="display:table">
                                        <tbody>
                                            <tr>
                                                <td height="10px" colspan="2">

                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:right">
                                                        Nome:
                                                    </p>
                                                </td>
                                                <td>
                                                    <p style="text-align:center;font-size:14px;color:#ffffff;margin:0;text-align:left;padding: 0 10px;box-sizing: border-box;">
                                                        ${req.body.nome}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:right">
                                                        Telefone:
                                                    </p>
                                                </td>
                                                <td>
                                                    <p style="text-align:center;font-size:14px;margin:0;text-align:left;padding: 0 10px;box-sizing: border-box;text-decoration:none!important;color:#ffffff!important">
                                                        ${req.body.telefone}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:right">
                                                        Email:
                                                    </p>
                                                </td>
                                                <td>
                                                    <p style="text-align:center;font-size:14px;color:#ffffff;margin:0;text-align:left;padding: 0 10px;box-sizing: border-box;text-decoration:none!important;color:#ffffff!important">
                                                        ${req.body.email}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:right">
                                                        Data de Nascimento:
                                                    </p>
                                                </td>
                                                <td>
                                                    <p style="text-align:center;font-size:14px;color:#ffffff;margin:0;text-align:left;padding: 0 10px;box-sizing: border-box;text-decoration:none!important;color:#ffffff!important">
                                                        ${req.body.nascimento}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:right">
                                                        RG:
                                                    </p>
                                                </td>
                                                <td>
                                                    <p style="text-align:center;font-size:14px;color:#ffffff;margin:0;text-align:left;padding: 0 10px;box-sizing: border-box;text-decoration:none!important;color:#ffffff!important">
                                                        ${req.body.rg}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:right">
                                                        CPF:
                                                    </p>
                                                </td>
                                                <td>
                                                    <p style="text-align:center;font-size:14px;color:#ffffff;margin:0;text-align:left;padding: 0 10px;box-sizing: border-box;text-decoration:none!important;color:#ffffff!important">
                                                        ${req.body.cpf}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="display:table">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                                        Mensagem
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td height="15px"></td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p style="text-align:center;font-size:14px;color:#ffffff;margin:0">
                                                                        ${req.body.mensagem}
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="50px"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                            </td>
                            <td width="100px">

                            </td>
                        </tr>
                        </tbody>
                    </table>
                </center>
            </body>
        </html>
    `

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'friendstour.funcionario@gmail.com',
               pass: 'minhamae2311'
        }
    });

    // setup email data with unicode symbols  friendstour1@outlook.com
    let mailOptions = {
        from: '"Friends Tour - Reserva" <friendstour.funcionario@gmail.com>', // sender address
        to: 'pereiradoohan@gmail.com', // list of receivers
        subject: 'Friends Tour - Reserva ✔', // Subject line
        text: 'Olá Ademar, temos mais uma reserva!', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            erro = error;
            confirm = false;
            return console.log(error);
        }
        erro = "E-mail enviado!";
        confirm = true;
        console.log(erro);
        console.log(confirm);
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.json({
            msg : erro,
            confirm : confirm
        });
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

    console.log(erro);
    console.log(confirm);
    

});



module.exports = router;