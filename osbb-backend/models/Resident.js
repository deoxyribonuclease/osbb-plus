const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Resident = sequelize.define('Resident', {
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
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    passportData: {
        type: DataTypes.STRING,
        allowNull: false
    },
    taxNum: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Resident;
