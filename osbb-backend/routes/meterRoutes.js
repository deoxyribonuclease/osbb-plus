const express = require('express');
const router = express.Router();
const meterController = require('../controllers/meterController');
const verifyToken = require("../middlewares/middleware");

router.get('/',verifyToken(['Accountant']), meterController.getAllMeters);
router.get('/:id', verifyToken(['Accountant']),meterController.getMeter);
router.get('/apartment/:apartmentId',verifyToken(['Accountant', 'Resident']), meterController.getMetersByApartment);
router.post('/',verifyToken(['Accountant', 'Resident']), meterController.createMeter);
router.patch('/:id',verifyToken(['Accountant']), meterController.updateMeter);
router.delete('/',verifyToken(['Accountant']), meterController.deleteMeter);
router.get('/house/:houseId',verifyToken(['Accountant']), meterController.getMetersByHouse );
router.post('/approveToPay',verifyToken(['Accountant']), meterController.ApproveToPay);


module.exports = router;
