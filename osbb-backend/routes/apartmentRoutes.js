const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartmentController');
const verifyToken = require("../middlewares/middleware");

router.get('/',verifyToken(['Accountant']), apartmentController.getAllApartments);
router.get('/:id',verifyToken(['Accountant']), apartmentController.getApartment);
router.get('/house/:houseId',verifyToken(['Accountant']), apartmentController.getApartmentsByHouse);
router.get('/resident/:residentId',verifyToken(['Accountant', 'Resident']), apartmentController.getApartmentsByResidentId);
router.post('/',verifyToken(['Accountant']), apartmentController.createApartment);
router.patch('/:id',verifyToken(['Accountant']), apartmentController.updateApartment);
router.delete('/:id',verifyToken(['Accountant']), apartmentController.deleteApartment);
router.post('/:apartmentId/createResidentAccount',verifyToken(['Accountant']), apartmentController.createResidentAccountToApartment);

module.exports = router;
