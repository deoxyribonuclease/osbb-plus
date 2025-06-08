const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseController');
const verifyToken = require("../middlewares/middleware");

router.get('/osbb/:osbbId', verifyToken(['Accountant']), expenseController.getExpensesByOsbbId);
router.post('/', verifyToken(['Accountant']), expenseController.createExpense);
router.patch('/:id',verifyToken(['Accountant']), expenseController.updateExpense);
router.delete('/:id', verifyToken(['Accountant']), expenseController.deleteExpense);

module.exports = router;