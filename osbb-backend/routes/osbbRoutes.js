const express = require('express');
const router = express.Router();

const osbbController = require('../controllers/osbbController');
const verifyToken = require("../middlewares/middleware");

router.get('/',verifyToken(['Moderator']), osbbController.getAllOSBBs);
router.get('/:id',verifyToken(['Accountant']), osbbController.getOSBB);
router.get('/user/:userId',verifyToken(['Accountant', 'Moderator']), osbbController.getOSBBsByUserId);
router.get("/resident/:residentId",verifyToken(['Resident']), osbbController.getOSBBsByResidentId);
router.post('/', osbbController.createOSBB);
router.patch('/:id',verifyToken(['Accountant','Moderator']), osbbController.updateOSBB);
router.delete('/:id',verifyToken(['Moderator']), osbbController.deleteOSBB);

module.exports = router;
