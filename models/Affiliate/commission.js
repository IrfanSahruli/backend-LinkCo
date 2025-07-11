const { DataTypes } = require('sequelize');
const database = require('../../config/database');
const User = require('../Users/user');
const Order = require('../Order/order');

const Commission = database.define('commission', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            key: 'id',
            model: User
        }
    },
    fromUserId: {
        type: DataTypes.INTEGER,
        references: {
            key: 'id',
            model: User
        }
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            key: 'id',
            model: Order
        }
    },
    total: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true
});

User.hasMany(Commission, { foreignKey: 'userId' });
Commission.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Commission, { foreignKey: 'fromUserId' });
Commission.belongsTo(User, { foreignKey: 'fromUserId' });

Order.hasMany(Commission, { foreignKey: 'orderId' });
Commission.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Commission;
