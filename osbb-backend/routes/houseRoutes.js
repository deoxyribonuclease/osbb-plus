const express = require('express');
const multer = require('multer');
const router = express.Router();

const houseController = require('../controllers/houseController');
const verifyToken = require("../middlewares/middleware");

const upload = multer();

router.get('/',verifyToken(['Accountant']), houseController.getAllHouses);
router.get('/:id',verifyToken(['Accountant']), houseController.getHouse);
router.get('/osbb/:osbbId',verifyToken(['Accountant']), houseController.getHousesByOSBB);
router.get('/resident/:residentId',verifyToken(['Accountant', 'Resident']), houseController.getHouseByResidentId);
router.post('/', upload.single('image'),verifyToken(['Accountant']), houseController.createHouse);
router.patch('/:id', upload.single('image'),verifyToken(['Accountant']), houseController.updateHouse);
router.delete('/:id',verifyToken(['Accountant']), houseController.deleteHouse);

module.exports = router;
