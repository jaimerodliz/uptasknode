const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

var transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
});

//generar html
const generarHtml = (archivo,opciones = {}) =>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`,opciones);
    return juice(html);
}

exports.enviar = async (opciones)=>{
    const html = generarHtml(opciones.archivo,opciones);
    const text = htmlToText.fromString(html)
    let mailOptions = {
        from:'Uptask <no-reply@uptask.com>',
        to:opciones.usuario.email,
        subject: opciones.subject,
        text: text,
        html: html
    }

    //util convierte funciones que no soporta async a una que si
    const enviarEmail = util.promisify(transport.sendMail,transport);
    return enviarEmail.call(transport,mailOptions);
}


