const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserNotification = sequelize.define('UserNotification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    notificationId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Notifications',
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
        onDelete: 'CASCADE',
        allowNull: false
    }
});
module.exports = UserNotification;
