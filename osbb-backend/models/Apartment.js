const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Apartment = sequelize.define('Apartment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    houseId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Houses',
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        allowNull: true
    },
    area: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    roomNum: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Apartment;
