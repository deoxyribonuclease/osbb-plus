const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const PaymentHistory = sequelize.define('PaymentHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    apartmentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Apartments',
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
    sum: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    remToPay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    meterType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = PaymentHistory;
