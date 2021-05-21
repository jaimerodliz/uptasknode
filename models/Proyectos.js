const { Sequelize } = require('sequelize');
const slug = require('slug');
const db = require('../config/db');
const shortid = require('shortid');

const Proyectos = db.define('proyectos',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre :  Sequelize.STRING,
    url : Sequelize.STRING
   
},{
    hooks: {
        beforeCreate(obj){
            const url = slug(obj.nombre).toLowerCase();
            obj.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;