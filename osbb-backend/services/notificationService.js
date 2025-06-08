const Notification = require('../models/Notification');
const UserNotification = require('../models/UserNotification');
const User = require('../models/User');

const getAll = async () => {
    return await Notification.findAll();
};

const get = async (id) => {
    return await Notification.findByPk(id);
};

const getByUser = async (userId) => {
    const notifications = await Notification.findAll({
        include: {
            model: User,
            where: { id: userId },
            attributes: ['id'],
            through: { attributes: [] }
        }
    });

    if (!notifications.length) {
        throw new Error('No notifications found for this user');
    }

    return notifications;
};




const add = async (notificationData) => {
    const { title, text, userIds } = notificationData;

    const notification = await Notification.create({
        title,
        text,
        date: new Date()
    });

    if (userIds && userIds.length > 0) {
        const userNotifications = userIds.map(userId => ({
            notificationId: notification.id,
            userId
        }));
        await UserNotification.bulkCreate(userNotifications);
    }

    return notification;
};

const update = async (id, notificationData) => {
    const { title, text } = notificationData;
    const notification = await Notification.findByPk(id);

    if (notification) {
        notification.title = title || notification.title;
        notification.text = text || notification.text;

        await notification.save();
        return notification;
    }

    return null;
};

const del = async (id) => {
    const notification = await Notification.findByPk(id);

    if (notification) {
        await notification.destroy();
        return true;
    }

    return false;
};

module.exports = { getAll , getByUser, get, add, update, del };
