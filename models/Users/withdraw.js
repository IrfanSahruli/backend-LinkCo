const { DataTypes } = require('sequelize');
const database = require('../../config/database');
const User = require('./user');

const Withdraw = database.define('withdraw', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    withdrawTo: {
        type: DataTypes.STRING
    },
    noRekening: {
        type: DataTypes.STRING
    },
    totalWithdraw: {
        type: DataTypes.INTEGER
    },
    selfiePhoto: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'approved', 'rejected']
    },
    rejectedReason: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

User.hasMany(Withdraw, { foreignKey: 'userId' });
Withdraw.belongsTo(User, { foreignKey: 'userId' });

module.exports = Withdraw;
