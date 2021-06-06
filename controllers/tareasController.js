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

//cambiar status de la tarea
exports.changeStatus = async(req, res, next)=>{
    const { id } = req.params;
    const tarea = await Tareas.findOne({ 
        where:{
            id: id
        }
    });

    //cambiar el estado
    let status = 0;
    if(tarea.estado == status){
        status=1;
    }

    //cambiar el valor del status
    tarea.estado = status;
    
    //actualizar el registro de tarea
    const resultado = await tarea.save();

    //si ocurrio un error ejecutar next para pausar el codigo
    if(!resultado){
        return next();
    }

    res.status(200).send('Actualizado..');
}

exports.deleteTarea = async(req, res, next)=>{
    const { id } = req.params;
    
    //eliminar la tarea

    const resultado = await Tareas.destroy({
        where:{
            id: id
        }
    });

    if(!resultado){
        return next();
    }

    res.status(200).send('Tarea eliminada correctamente');
}