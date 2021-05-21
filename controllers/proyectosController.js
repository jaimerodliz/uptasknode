const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');

exports.proyectosHome = async(req, res) => {
    //obtener los registros de la BD
    const proyectos = await Proyectos.findAll();


    res.render('index_v',{
        nombrePagina : 'Proyectos ' +res.locals.year,
        proyectos
    });
} 

exports.formularioProyecto = async(req,res)=>{
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto',{
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto =  async (req,res) =>{
   //enviar a la consola lo que el usuario escribe
   //console.log(req.body)

   //validar el input

   const { nombre } = req.body; //crear variable y obtener valor al mismo tiempo

    let errores=[];

    if(!nombre){
        errores.push({'texto':'Agrega un Nombre al Proyecto'});
    }

    //si hay errores
    if(errores.length > 0){
        const proyectos = await Proyectos.findAll();
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //no hay errores - insertar en la bd
        //forma normal
        /*Proyectos.create({nombre})
            .then(() => console.log('Insertado Correctamente'))
            .catch(eeror => console.log(error));*/ 

        //forma asincrona
        //const url = slug(nombre).toLowerCase();
        const proyecto = await Proyectos.create({nombre});
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async(req, res, next) =>{
    //obtener un registro de la BD
    const obj = await Proyectos.findOne({
        where:{
            url: req.params.url
        }
    });

    const proyectos = await Proyectos.findAll();

    const tareas = await Tareas.findAll({
        where:{
            proyectoId : obj.id
        }
        //include: [ //obtiene los datos del modelo funciona como un tipo join
            //{ model: Proyectos }
       // ]
    });
    
    //validar que la consulta tenga resultados
    if(!obj) return next();

    res.render('tareas',{
        nombrePagina: 'Tareas del Proyecto',
        obj,
        proyectos,
        tareas
    });
}

exports.formularioEditar = async(req,res) =>{
    const proyectosPromise = Proyectos.findAll();
    
    const proyectoPromise = Proyectos.findOne({
        where:{
            id:req.params.id
        }
    });

    /*ejecutar multiles consultas independientes al mismo tiempo
    con promesas*/

    const [proyectos,proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);

    //render a la vista
    res.render('nuevoProyecto',{
        nombrePagina:"Editar Proyecto",
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async(req,res) => {
   //validar el input
   const { nombre } = req.body; //crear variable y obtener valor al mismo tiempo

   let errores=[];

   if(!nombre){
       errores.push({'texto':'Agrega un Nombre al Proyecto'});
   }

   //si hay errores
   if(errores.length > 0){
       const proyectos = await Proyectos.findAll();
       res.render('nuevoProyecto',{
           nombrePagina: 'Editar Proyecto',
           errores,
           proyectos
       })
   }else{
       //no hay errores - insertar en la bd
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id }}
        );
       res.redirect('/');
   }
}

exports.eliminarProyecto = async(req, res, next) =>{
    const {url} = req.params;

    const result = await Proyectos.destroy({
        where:{
            url: url
        }
    });

    if(!result){
        return next();
    }

    res.status(200).send('Proyecto Eliminado');
}