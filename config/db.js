const { Sequelize } = require('sequelize');
//extraer valores de variables.env
require('dotenv').config({ path: 'variables.env'});

const sequelize = new Sequelize(process.env.BD_NOMBRE, process.env.DB_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    define:{
        timestamps:false
    }
});

module.exports = sequelize;