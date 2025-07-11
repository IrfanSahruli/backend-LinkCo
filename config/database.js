const { Sequelize } = require('sequelize');

const database = new Sequelize(process.env.DBNAME, process.env.nama, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql'
});

module.exports = database;
