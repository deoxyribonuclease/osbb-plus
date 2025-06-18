const paymentService = require('../services/paymentService');
const Apartment = require('../models/Apartment');



const BalanceList = async (req, res) => {
    try {
        const payments = await paymentService.BalanceGetAll();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve payments: ${error.message}` });
    }
};

const BalanceFind = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await paymentService.BalanceGet(id);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get payment: ${error.message}` });
    }
};

const BalanceByApartment = async (req, res) => {
    const { apartmentId } = req.params;
    try {
        const payments = await paymentService.BalanceGetByApartment(apartmentId);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve payments for apartment: ${error.message}` });
    }
};

const BalanceSumByApartment = async (req, res) => {
    const { apartmentIds } = req.body;
    try {
        const debts = await paymentService.GetBalanceSumByApartment(apartmentIds);
        res.status(200).json(debts);
    } catch (error) {
        res.status(500).json({ error: `Failed to calculate sum for apartments: ${error.message}` });
    }
};


const BalanceCreate = async (req, res) => {
    const { apartmentId, meterType, sum } = req.body;

    const apartmentExists = await Apartment.findByPk(apartmentId);
    if (!apartmentExists) {
        return res.status(400).json({ error: "Apartment with the given ID does not exist" });
    }

    try {
        const newPayment = await paymentService.BalanceAdd({ apartmentId, meterType, sum });
        return res.json(newPayment);
    } catch (error) {
        return res.status(500).json({ error: `Server error: ${error.message}` });
    }
};


const BalanceUpdate = async (req, res) => {
    const { id } = req.params;
    const { apartmentId, meterType, sum } = req.body;
    if (typeof sum !== 'number' || isNaN(sum)) {
        return res.status(400).json({ error: 'Invalid value: sum must be a number' });
    }
    if (sum < 0) {
        return res.status(400).json({ error: 'Invalid value: sum cannot be negative' });
    }

    try {
        const updatedPayment = await paymentService.BalanceUpdate(id, { apartmentId, meterType, sum });
        if (updatedPayment) {
            res.status(200).json(updatedPayment);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update payment: ${error.message}` });
    }
};


const BalanceDelete = async (req, res) => {
    const { id } = req.params;
    try {
        if (await paymentService.BalanceDelete(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete payment: ${error.message}` });
    }
};



//історія


const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAll();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve payments: ${error.message}` });
    }
};

const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await paymentService.get(id);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get payment: ${error.message}` });
    }
};


const getPaymentByApartmentId = async (req, res) => {
    const { apartmentId } = req.params;
    try {
        const payment = await paymentService.getByApartment(apartmentId);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get payment: ${error.message}` });
    }
};

const createPayment = async (req, res) => {
    const { apartmentId, sum, date, meterType, status } = req.body;

    try {

        const newPayment = await paymentService.BalanceAdd({ apartmentId, meterType, sum: sum * -1 });

        if (!newPayment) {
            return res.status(400).json({ error: "Не вдалося створити платіж" });
        }

        const newPaymentHistory = await paymentService.add({
            apartmentId,
            sum,
            remToPay: newPayment.sum,
            date,
            meterType,
            status
        });


        const excludedTypes = ["Електроенергія", "Вода", "Газ", "Опалення", "Утримання будинку"];
        if (newPayment.sum <= 0 && !excludedTypes.includes(meterType)) {
            await paymentService.BalanceDelete(newPayment.id);
        }

        res.status(201).json(newPaymentHistory);
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};



const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { apartmentId, sum,remToPay, date, type, status } = req.body;
    try {
        const updatedPayment = await paymentService.update(id, { apartmentId, sum, remToPay, date, type, status });
        if (updatedPayment) {
            res.status(200).json(updatedPayment);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update payment: ${error.message}` });
    }
};

const deletePayment = async (req, res) => {
    const { id } = req.params;
    try {
        if (await paymentService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete payment: ${error.message}` });
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    getPaymentByApartmentId,
    createPayment,
    updatePayment,
    deletePayment,
    BalanceList,
    BalanceFind,
    BalanceByApartment,
    BalanceSumByApartment,
    BalanceCreate,
    BalanceUpdate,
    BalanceDelete };
