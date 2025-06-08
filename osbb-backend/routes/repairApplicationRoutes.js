const express = require('express');
const router = express.Router();
const repairApplicationController = require('../controllers/repairApplicationController');
const multer = require('multer');
const verifyToken = require("../middlewares/middleware");
const upload = multer();

router.get('/',verifyToken(['Moderator']), repairApplicationController.getAllApplications);
router.get('/:id',verifyToken(['Resident', 'Accountant']), repairApplicationController.getApplication);
router.get('/apartment/:apartmentId',verifyToken(['Accountant','Resident']), repairApplicationController.getApplicationsByApartment);
router.get('/osbb/:osbbId',verifyToken(['Accountant']), repairApplicationController.getApplicationsByOsbb);
router.post('/', upload.single('image'),verifyToken(['Resident']), repairApplicationController.createApplication);
router.patch('/:id', upload.single('image'),verifyToken(['Accountant']), repairApplicationController.updateApplication);
router.delete('/:id',verifyToken(['Accountant','Resident']), repairApplicationController.deleteApplication);

module.exports = router;
