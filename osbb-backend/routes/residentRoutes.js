const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const verifyToken = require("../middlewares/middleware");

router.get('/',verifyToken(['Accountant']), residentController.getAllResidents);
router.get('/:id',verifyToken(['Accountant']), residentController.getResident);
router.get('/apartment/:apartmentId',verifyToken(['Accountant']), residentController.getResidentsByApartment);
router.get('/house/:houseId',verifyToken(['Accountant']), residentController.getResidentsByHouse);
router.post('/',verifyToken(['Accountant']), residentController.createResident);
router.patch('/:id',verifyToken(['Accountant']), residentController.updateResident);
router.delete('/:id',verifyToken(['Accountant']), residentController.deleteResident);

module.exports = router;
