const express = require('express');
const router = express.Router();

//importar express validator
const { body } = require('express-validator');

//importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){

    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    router.get('/nosotros', (req, res) =>{
        res.render('nosotros')
    });

    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    //guardar proyecto
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );
    //editar proyecto
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    //listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    router.get('/proyecto/editar/:id',authController.usuarioAutenticado,proyectosController.formularioEditar);

    //eliminar proyecto
    router.delete('/proyectos/:url',authController.usuarioAutenticado,proyectosController.eliminarProyecto);

    //TAREAS
    router.post('/proyectos/:url',authController.usuarioAutenticado, tareasController.saveTarea);

    //actualizar tarea
    //put- cambia todo el registro patch-solo cambia el campo a actualizar
    router.patch('/tareas/:id', authController.usuarioAutenticado,tareasController.changeStatus);

    //eliminar una tarea
    router.delete('/tareas/:id',authController.usuarioAutenticado, tareasController.deleteTarea);

    //crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);

    router.post('/crear-cuenta', usuariosController.cearCuenta);

    router.get('/confirmar/:correo',usuariosController.confirmarCuenta);
    
    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);

    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion',authController.cerrarSesion);

    //reestableces contraseña
    router.get('/reestableces',usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);

    router.get('/reestablecer/:token',authController.resetPassword)
    router.post('/reestablecer/:token',authController.actualizarPassword);



    return router;
}

