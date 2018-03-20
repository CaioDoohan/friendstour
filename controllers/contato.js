var express      = require('express');
var nodemailer   = require('nodemailer');
var router       = express.Router();

router.get('/', function(req, res, next) {
    if( req.query.mt != undefined ){
        res.render('contato', { title: 'Friendstour - Contato', mt : true});
    }else{
        res.render('contato', { title: 'Friendstour - Contato', mt : false});
    }
});

router.post('/formulario_enviado', function(req, res, next) {
    // console.log(req.body);
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
                                <p style="font-size:25px;color:#f58731;font-weight:bold;text-align:center;margin:0">Friend's Tour - Contato</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" height="30px"></td>
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
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                        Nome: ${req.body.nome}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                        Telefone: ${req.body.telefone}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                        Email: ${req.body.email}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                     Por onde conheceu a Friend's Tour?: ${req.body.redesocial}
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
        from: '"Friends Tour - Contato" <friendstour.funcionario@gmail.com>', // sender address
        to: 'friendstour1@outlook.com', // list of receivers
        subject: 'Friends Tour - Contato', // Subject line
        text: 'Olá Ademar, temos uma mensagem para contato', // plain text body
        html: output // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            erro = error;
            confirm = false;
            return console.log(error);
        }
        erro = "E-mail enviado!";
        confirm = true;
        res.json({
            msg : erro,
            confirm : confirm
        });
    });
});

router.post('/seu-pacote', function(req, res, next) {
    // console.log(req.body);
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
                                <p style="font-size:25px;color:#f58731;font-weight:bold;text-align:center;margin:0">Friend's Tour - Pacote</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" height="30px"></td>
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
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                        Nome: ${req.body.nome}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                        Telefone: ${req.body.telefone}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                        Destino: ${req.body.destino}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                     Quantidade de pessoas:
                                                    </p>
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">${req.body.qtd}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                     Data de ida: ${req.body.ida}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20px"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <p style="font-size:15px;color:#ffffff;font-weight:bold;margin:0;text-align:center">
                                                     Data de volta: ${req.body.volta}
                                                    </p>
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
        from: '"Friends Tour - Pacote" <friendstour.funcionario@gmail.com>', // sender address
        to: 'friendstour1@outlook.com', // list of receivers
        subject: 'Friends Tour - Pacote', // Subject line
        text: 'Olá Ademar, temos uma mensagem para montar pacote', // plain text body
        html: output // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            erro = error;
            confirm = false;
            return console.log(error);
        }
        erro = "E-mail enviado!";
        confirm = true;
        res.json({
            msg : erro,
            confirm : confirm
        });
    });
});

module.exports = router;