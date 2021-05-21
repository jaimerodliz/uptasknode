const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.saveTarea = async(req, res, next) => {
    //obtener proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    //leer valor del input
    const {tarea} =req.body;

    //estado 0=incompleto y id del proyecto
    const estado=0;
    const proyectoId= proyecto.id;

    //insertar en la bd
    const resultado = await Tareas.create({tarea,estado,proyectoId});

    if(!resultado){
        return next();
    }
    
    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}