const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail:{
                msg: 'Agrega un Correo Valido'
            },
            notEmpty:{
                msg: 'El password no puede ir vacio'
            }
        },
        unique:{
            args: true,
            msg: 'Usuario ya registrado'
        }
    },password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'El password no puede ir vacio'
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING(250),
    expiracion: Sequelize.DATE
},{ 
    hooks:{
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//metodos personalizados
Usuarios.prototype.verificarPassword = function(password){
    //verifica la contraseña hash
    return bcrypt.compareSync(password,this.password);
}

Usuarios.hasMany(Proyectos);
//crear llave foranea
//Usuarios.belongsTo(Proyectos); 

module.exports = Usuarios;