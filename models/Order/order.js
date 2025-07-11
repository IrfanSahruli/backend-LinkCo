const { DataTypes } = require('sequelize');
const database = require('../../config/database');
const User = require('../Users/user');
const Product = require('../Product/product');

const Order = database.define('order', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            key: 'id',
            model: User
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            key: 'id',
            model: Product
        }
    },
    jumlah: {
        type: DataTypes.INTEGER
    },
    total: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'selesai', 'gagal']
    }
}, {
    freezeTableName: true
});

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Order;
