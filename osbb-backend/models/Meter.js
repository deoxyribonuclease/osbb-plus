const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Meter = sequelize.define('Meter', {
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
    prevIndicators: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    currIndicators: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    consumption: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    meterType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    amountDue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    toPay: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});

module.exports = Meter;
