const { DataTypes } = require('sequelize');
const database = require('../../config/database');
const User = require('../Users/user');

const Affiliate = database.define('affiliate', {
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
    referral: {
        type: DataTypes.STRING
    },
    referralCode: {
        type: DataTypes.STRING
    },
    referralBy: {
        type: DataTypes.INTEGER,
        references: {
            key: 'id',
            model: User
        }
    }
}, {
    freezeTableName: true
});

// Relasi User Affiliate
User.hasOne(Affiliate, { foreignKey: 'userId', as: 'affiliate' });
User.hasMany(Affiliate, { foreignKey: 'referralBy', as: 'referrals' });

// Relasi Affiliate User
Affiliate.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // ini untuk pemilik akun
Affiliate.belongsTo(User, { foreignKey: 'referralBy', as: 'referrer' }); // ini untuk yang ngajak


module.exports = Affiliate
