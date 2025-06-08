const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
const sequelize = require('../db');
const OSBB = require('./Osbb');
const Osbb = require("./Osbb");
const Apartment = require("./Apartment");

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Accountant'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    hooks: {
        afterCreate: async (user, options) => {
            if (user.role === 'Accountant' && options.osbbName) {
                try {
                    await OSBB.create({
                        name: options.osbbName,
                        address: 'Адреса не вказана',
                        contact: user.email,
                        creationDate: new Date(),
                        userId: user.id
                    });
                } catch (error) {
                    console.error('Помилка створення ОСББ:', error);
                }
            }
        }
    }
});

User.hasOne(Osbb, { foreignKey: 'userId', onDelete: 'CASCADE'  });
Osbb.belongsTo(User, { foreignKey: 'userId' });

Apartment.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
