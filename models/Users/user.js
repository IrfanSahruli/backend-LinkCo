const { DataTypes } = require('sequelize');
const database = require('../../config/database');

const User = database.define('user', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    noHandPhone: {
        type: DataTypes.INTEGER
    },
    password: {
        type: DataTypes.STRING
    },
    saldo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isKYCApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin']
    }
}, {
    freezeTableName: true
});

module.exports = User;
