const express = require('express');
const router = express.Router();

//importar express validator
const { body } = require('express-validator');

//importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');

module.exports = function(){

    router.get('/',proyectosController.proyectosHome);

    router.get('/nosotros', (req, res) =>{
        res.render('nosotros')
    });

    router.get('/nuevo-proyecto',proyectosController.formularioProyecto);

    //guardar proyecto
    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );
    //editar proyecto
    router.post('/nuevo-proyecto/:id',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    //listar proyecto
    router.get('/proyectos/:url',proyectosController.proyectoPorUrl);

    router.get('/proyecto/editar/:id',proyectosController.formularioEditar);

    //eliminar proyecto
    router.delete('/proyectos/:url',proyectosController.eliminarProyecto);

    //TAREAS
    router.post('/proyectos/:url', tareasController.saveTarea);

    return router;
}

