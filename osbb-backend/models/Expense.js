const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    osbbId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Osbbs",
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
    expenseType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
});



module.exports = Expense;
