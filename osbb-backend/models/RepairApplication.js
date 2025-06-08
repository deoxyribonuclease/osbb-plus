const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Apartment = require("./Apartment");

const RepairApplication = sequelize.define('RepairApplication', {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
});

Apartment.hasMany(RepairApplication, { foreignKey: 'apartmentId', onDelete: 'CASCADE' });
RepairApplication.belongsTo(Apartment, { foreignKey: 'apartmentId' });

module.exports = RepairApplication;
