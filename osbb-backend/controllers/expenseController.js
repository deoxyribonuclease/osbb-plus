const expenseService = require('../services/expenseService');




const getExpensesByOsbbId = async (req, res) => {
    const { osbbId } = req.params;
    try {
        const expenses = await expenseService.getByOsbbId(osbbId);
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: `Failed to get expenses by osbbId: ${error.message}` });
    }
};

const createExpense = async (req, res) => {
    const { osbbId, expenseType, description, amount, date } = req.body;
    try {
        const newExpense = await expenseService.add({ osbbId, expenseType, description, amount, date });
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { osbbId, expenseType, description, amount, date } = req.body;
    try {
        const updatedExpense = await expenseService.update(id, { osbbId, expenseType, description, amount, date });
        if (updatedExpense) {
            res.status(200).json(updatedExpense);
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update expense: ${error.message}` });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        if (await expenseService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete expense: ${error.message}` });
    }
};

module.exports = {
    getExpensesByOsbbId,
    createExpense,
    updateExpense,
    deleteExpense
};
