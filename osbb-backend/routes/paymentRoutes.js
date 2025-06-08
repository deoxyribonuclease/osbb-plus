const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const verifyToken = require("../middlewares/middleware");

router.get('/history/all/:id',verifyToken([ 'Accountant']), paymentController.getPaymentById);
router.get('/history/:apartmentId',verifyToken(['Resident', 'Accountant']), paymentController.getPaymentByApartmentId);
router.post('/history/',verifyToken(['Resident']), paymentController.createPayment);
router.patch('/history/:id',verifyToken(['Resident', 'Accountant']), paymentController.updatePayment);


router.get('/:id',verifyToken(['Moderator']), paymentController.BalanceFind);
router.get('/apartment/:apartmentId',verifyToken(['Resident', 'Accountant']), paymentController. BalanceByApartment);
router.get('/debt/:apartmentId',verifyToken(['Resident', 'Accountant']), paymentController.BalanceSumByApartment);
router.post('/',verifyToken(['Resident', 'Accountant']), paymentController.BalanceCreate);
router.patch('/:id',verifyToken(['Moderator']), paymentController.BalanceUpdate);
router.delete('/:id',verifyToken(['Moderator']), paymentController.BalanceDelete);

module.exports = router;
