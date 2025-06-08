const express = require('express');
const router = express.Router();

const newsController = require('../controllers/newsController');
const verifyToken = require("../middlewares/middleware");

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.get('/:id/neighbors', newsController.getNewsNeighbors);
router.post('/', verifyToken(['Moderator']), newsController.createNews);
router.patch('/:id', verifyToken(['Moderator']), newsController.updateNews);
router.delete('/:id', verifyToken(['Moderator']), newsController.deleteNews);

module.exports = router;
