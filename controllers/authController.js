const { response } = require('express');
const passport = require('passport');
const Sequelize= require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

//const { Sequelize } = require('sequelize/types');
 
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son obligatorios' //mesanje por defecto
});

//funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) =>{
    //si el usuario esta authenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    //sino esta aithenticado, redirigir al formulario

    return res.redirect('/iniciar-sesion');
}

//funcion para cerrar sesion
exports.cerrarSesion = (req, res)=>{
    //destruir sesion y redirecionar
    req.session.destroy(() =>{
        res.redirect('/iniciar-sesion');
    });
}

//genera un token si el usuario es valido
exports.enviarToken = async(req, res) =>{
    console.log(req.body);
    const { email } = req.body;
    //verificar que el usuario existe
    const usuario = await Usuarios.findOne({
        where:{
            email
        }
    });

    //si no existe el usuario 
    if(!usuario){
        req.flash('error','No existe esa cuenta');
        res.redirec('/reestablecer');
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardarlos en la base de datos
    await usuario.save();

    //url de reset
    const resetUrl=`http://${req.headers.host}/reestablecer/${usuario.token}`; 
    console.log(resetUrl);
    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecerPassword'
    });
    
    req.flash('correcto','Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.resetPassword = async(req, res)=>{
    //res.json(req.params.token);
    const { token } = req.params;
    const usuario = await Usuarios.findOne({
        where:{
            token: token
        }
    });

    //si no existe el usuario 
    if(!usuario){
        req.flash('error','E-mail no válido');
        res.redirec('/reestablecer');
    }

    res.render('resetPassword',{
        nombrePagina : 'Reestablecer Password'
    });
}

//cambia el passowrd por uno nuevo
exports.actualizarPassword = async(req, res) =>{
    // Verifica el token valido pero también la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
    
    // guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

} 