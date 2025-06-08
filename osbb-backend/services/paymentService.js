const PaymentHistory = require("../models/paymentHistory");
const Balance = require('../models/Balance');


//баланс
const BalanceGetAll = async () => {
    return await Balance.findAll();
};

const BalanceGet = async (id) => {
    return await Balance.findByPk(id);
};

const BalanceGetByApartment = async (apartmentId) => {
    return await Balance.findAll({ where: { apartmentId } });
};

const BalanceAdd = async (paymentData) => {
    const { apartmentId, meterType, sum } = paymentData;

    const [existingPayment, created] = await Balance.findOrCreate({
        where: { apartmentId, meterType },
        defaults: { sum }
    });

    if (!created) {
        existingPayment.sum += sum;
        await existingPayment.save();
    }

    return existingPayment;
};


const { Op } = require('sequelize');

const GetBalanceSumByApartment = async (apartmentId) => {
    const total = await Balance.sum('sum', {
        where: {
            apartmentId,
            sum: { [Op.gte]: 0 }
        }
    });
    return total || 0;
};


const BalanceUpdate = async (id, paymentData) => {
    const { apartmentId, meterType, sum } = paymentData;
    const payment = await Balance.findByPk(id);

    if (payment) {
        payment.apartmentId = apartmentId || payment.apartmentId;
        payment.meterType = meterType || payment.meterType;
        payment.sum = sum || payment.sum;

        await payment.save();
        return payment;
    }
    return null;
};

const BalanceDelete = async (id) => {
    const payment = await Balance.findByPk(id);
    if (payment) {
        await payment.destroy();
        return true;
    }
    return false;
};


//історія
const getAll = async () => {
    return await PaymentHistory.findAll();
};

const get = async (id) => {
    return await PaymentHistory.findByPk(id);
};

const getByApartment = async (apartmentId) => {
    return await PaymentHistory.findAll({ where: { apartmentId } });
};


const add = async (paymentData) => {
    const { apartmentId, sum,remToPay, date, meterType, status } = paymentData;
    return await PaymentHistory.create({ apartmentId, sum,remToPay, date, meterType, status });
};

const update = async (id, paymentData) => {
    const { apartmentId, sum, date, type, status } = paymentData;
    const payment = await PaymentHistory.findByPk(id);
    if (payment) {
        payment.apartmentId = apartmentId || payment.apartmentId;
        payment.sum = sum || payment.sum;
        payment.date = date || payment.date;
        payment.type = type || payment.type;
        payment.status = status || payment.status;

        await payment.save();
        return payment;
    }
    return null;
};

const del = async (id) => {
    const payment = await PaymentHistory.findByPk(id);
    if (payment) {
        await payment.destroy();
        return true;
    }
    return false;
};

module.exports = {
    getAll,
    get,
    getByApartment,
    add,
    update,
    del,
    BalanceGetAll,
    BalanceGet,
    BalanceGetByApartment,
    GetBalanceSumByApartment,
    BalanceAdd,
    BalanceUpdate,
    BalanceDelete };
