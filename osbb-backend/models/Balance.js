const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Balance = sequelize.define('Balance', {
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
    meterType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sum: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
});



module.exports = Balance;
