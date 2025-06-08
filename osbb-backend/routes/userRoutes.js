const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const verifyToken = require("../middlewares/middleware");

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id',verifyToken(['Accountant', 'Moderator']), userController.deleteUser);
router.get("/all/accountants", userController.getAccountantsWithHierarchy);


module.exports = router;
