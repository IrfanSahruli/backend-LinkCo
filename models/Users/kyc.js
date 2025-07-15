const { DataTypes } = require("sequelize");
const database = require("../../config/database");
const User = require("./user");

const Kyc = database.define('kyc', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    fullName: {
        type: DataTypes.STRING
    },
    nik: {
        type: DataTypes.STRING
    },
    placeOfBirth: {
        type: DataTypes.STRING
    },
    dateOfBirth: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    ktpPhoto: {
        type: DataTypes.STRING
    },
    selfiePhoto: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'verified', 'rejected']
    },
    rejectedReason: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

User.hasOne(Kyc, { foreignKey: 'userId' });
Kyc.belongsTo(User, { foreignKey: 'userId' });

module.exports = Kyc;
