const express = require('express');
const routes = require('./routes/routes');
const path = require('path');
const bodyParser = require('body-parser');

//helpers con algunas funciones
const helpers = require('./helpers');

//importar el modelo
require('./models/Proyectos');
require('./models/Tareas');

//Crear la conexion a la BD
const db = require('./config/db');
const { nextTick } = require('process');
//verifica conexion a la BD
//db.authenticate()
    //.then(() => console.log('Conectado al Servidor'))
    //.catch(error => console.log(error))

//conectar ala bd y crear estructura definida en el modelo
db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error))


//crear una app de express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

//habilitar motor visual pug
app.set('view engine','pug');

//pasar vardump a la aplicacion
app.use((req, res, next)=> {
    const fecha = new Date();
    //variables globales disponibles en todo el proyecto
    res.locals.year = fecha.getFullYear();
    res.locals.vardump = helpers.vardump;
    next();
});

//aprendiendo middleware
/*app.use((req, res, next) =>{
    console.log("Yo soy middleware");
    next();
});*/



//añadir la carpeta de las vistas
app.set('views',path.join(__dirname, 'views'))

//habilitar body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}))

//cargar rutas desde un archivo externo
app.use('/', routes());
 

//puerto en el conecta la api
app.listen(3001);
