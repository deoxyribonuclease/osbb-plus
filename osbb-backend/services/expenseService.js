const Expense = require("../models/Expense");

const getByOsbbId = async (osbbId) => {
    return await Expense.findAll({
        where: { osbbId }
    });
};

const add = async (expenseData) => {
    const { osbbId, expenseType, description, amount, date } = expenseData;
    return await Expense.create({ osbbId, expenseType, description, amount, date });
};

const update = async (id, expenseData) => {
    const { osbbId, expenseType, description, amount, date } = expenseData;
    const expenseItem = await Expense.findByPk(id);
    if (expenseItem) {
        expenseItem.osbbId = osbbId || expenseItem.osbbId;
        expenseItem.expenseType = expenseType || expenseItem.expenseType;
        expenseItem.description = description || expenseItem.description;
        expenseItem.amount = amount || expenseItem.amount;
        expenseItem.date = date || expenseItem.date;

        await expenseItem.save();
        return expenseItem;
    }
    return null;
};

const del = async (id) => {
    const expenseItem = await Expense.findByPk(id);
    if (expenseItem) {
        await expenseItem.destroy();
        return true;
    }
    return false;
};

module.exports = {  getByOsbbId, add, update, del };
