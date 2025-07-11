const { DataTypes } = require('sequelize');
const database = require('../../config/database');

const Product = database.define('product', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    productName: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING
    },
    imageUrl: {
        type: DataTypes.STRING
    },
    linkProduct: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

module.exports = Product;
