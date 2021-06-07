const express = require('express');
const routes = require('./routes/routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//const expressValidator = require('express-validator'); 
const passport = require('./config/passport');
//importar las variables
require('dotenv').config({ path: 'variables.env'});


//helpers con algunas funciones
const helpers = require('./helpers');

//importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

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

//habilitar body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}))

// Agregamos express validator a toda la aplicación
//app.use(expressValidator());

//aprendiendo middleware
/*app.use((req, res, next) =>{
    console.log("Yo soy middleware");
    next();
});*/

//añadir la carpeta de las vistas
app.set('views',path.join(__dirname, 'views'))

app.use(cookieParser());

// sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
    secret: "keyboard cat", 
    resave: false, 
    saveUninitialized: false 
}));

//agregar flash middleware
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la aplicacion
app.use((req, res, next)=> {
    const fecha = new Date();
    //variables globales disponibles en todo el proyecto
    res.locals.year = fecha.getFullYear();
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    //crea una copia del usuario logueado caso contrario asigna null
    res.locals.usuario = {...req.user} || null;

    //console.log(res.locals);
    next();
});

//cargar rutas desde un archivo externo
app.use('/', routes());
 

//puerto en el conecta la api
//servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3001;
app.listen(port,host, () =>{
    console.log('El servidor esta LISTO!')
});

