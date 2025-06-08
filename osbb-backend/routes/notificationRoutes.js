const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const verifyToken = require("../middlewares/middleware");

router.get('/:id',verifyToken(['Accountant','Resident']), notificationController.getNotification);
router.get('/user/:userId',verifyToken(['Accountant', 'Resident']), notificationController.getNotificationsByUser);
router.post('/', verifyToken(['Accountant', 'Moderator']), notificationController.createNotification);
router.delete('/:id',verifyToken(['Resident', 'Accountant']), notificationController.deleteNotification);

module.exports = router;
