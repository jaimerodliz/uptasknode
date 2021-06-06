const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = ( req, res ) =>{
    res.render('crearCuenta',{
        nombrePagina: 'Crear cuenta en UpTask'
    });
}

exports.formIniciarSesion = ( req, res ) =>{
    const { error }= res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar Sesión',
        error: error
    });
}

exports.cearCuenta = async(req, res,next) =>{
    //leer los datos
    const {email,password} = req.body;
    try{
        //crear el usuario
        await Usuarios.create({
            email,
            password
        });

        //crear una URL de confirmar
        const confirmtUrl=`http://${req.headers.host}/confirmar/${email}`; 

        //crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email de confirmacion
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta',
            confirmtUrl,
            archivo: 'confirmarCuenta'
        });


        //redirigir al usuario
        req.flash('correcto','Enviarmos un correo, confirma tu cuenta')
        res.redirect('/iniciar-sesion');
    }catch(error){
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Crear Cuenta en Uptask',
            email: email,
            password // si ambos campos se llaman igual se pasa como una sola variable
        })
    }
    /*//crear el usuario
    Usuarios.create({
        email,
        password
    }).then(() =>{//utilizar promesa para validar que el usuario se creo y redireccionar
        res.redirect('/iniciar-sesion');
    });*/
}

exports.formRestablecerPassword = (req,res) =>{
    res.render('reestablecer',{
        nombrePagina: 'Restableces tu Contraseña'
    });
}

//activa la cuenta nueva
exports.confirmarCuenta = async(req,res) => {
    const { correo }= req.params;

    const usuario = await Usuarios.findOne({
        email: correo
    });

    if(!usuario){
        req.flash('error','Cuenta no valida');
        res.redirect('/crear-cuenta');
    }

    //activar usuario
    usuario.activo=1;
    await usuario.save();

    req.flash('correcto','Su cuenta ha sido activada');
    res.redirect('/iniciar-sesion');
}