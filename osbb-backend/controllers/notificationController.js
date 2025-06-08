const { Sequelize } = require('sequelize');
const notificationService = require('../services/notificationService');

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getAll();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve notifications: ${error.message}` });
    }
};

const getNotification = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await notificationService.get(id);
        if (notification) {
            res.status(200).json(notification);
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get notification: ${error.message}` });
    }
};

const getNotificationsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await notificationService.getByUser(userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: `Failed to get notifications for user: ${error.message}` });
    }
};

const createNotification = async (req, res) => {
    const { title, text, userIds } = req.body;
    try {
        const newNotification = await notificationService.add({ title, text, userIds });
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};

const updateNotification = async (req, res) => {
    const { id } = req.params;
    const { title, text } = req.body;
    try {
        const updatedNotification = await notificationService.update(id, { title, text });
        if (updatedNotification) {
            res.status(200).json(updatedNotification);
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update notification: ${error.message}` });
    }
};

const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        if (await notificationService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete notification: ${error.message}` });
    }
};

module.exports = {
    getAllNotifications,
    getNotification,
    getNotificationsByUser,
    createNotification,
    updateNotification,
    deleteNotification
};
