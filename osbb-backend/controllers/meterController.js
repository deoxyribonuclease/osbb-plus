const meterService = require('../services/meterService');
const Apartment = require('../models/apartment');
const { BalanceAdd} = require('../services/paymentService');

const getAllMeters = async (req, res) => {
    try {
        const meters = await meterService.getAll();
        res.status(200).json(meters);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve meters: ${error.message}` });
    }
};

const getMeter = async (req, res) => {
    const { id } = req.params;
    try {
        const meter = await meterService.get(id);
        if (meter) {
            res.status(200).json(meter);
        } else {
            res.status(404).json({ error: 'Meter not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get meter: ${error.message}` });
    }
};

const getMetersByApartment = async (req, res) => {
    const { apartmentId } = req.params;
    try {
        const meters = await meterService.getByApartment(apartmentId);
        res.status(200).json(meters);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve meters for apartment: ${error.message}` });
    }
};

const createMeter = async (req, res) => {
    const { apartmentId, prevIndicators, currIndicators, consumption, meterType, date, rate } = req.body;

    try {
        const apartmentExists = await Apartment.findByPk(apartmentId);
        if (!apartmentExists) {
            return res.status(400).json({ error: "Apartment with the given ID does not exist" });
        }

        const prevMeter = await meterService.getLastMeterByApartment(apartmentId, meterType);
        const prevIndicatorsValue = prevIndicators ?? (prevMeter ? prevMeter.currIndicators : 0);
        const actualConsumption = consumption ?? (currIndicators - prevIndicatorsValue);

        const newMeter = await meterService.add({
            apartmentId,
            prevIndicators: prevIndicatorsValue,
            currIndicators,
            consumption: actualConsumption,
            meterType,
            date,
            rate
        });

        res.status(201).json(newMeter);
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};


const updateMeter = async (req, res) => {
    const { id } = req.params;
    const { apartmentId,prevIndicators, currIndicators, consumption, meterType, date, rate, amountDue } = req.body;

    try {
        const updatedMeter = await meterService.update(id, { apartmentId, prevIndicators, currIndicators, consumption, meterType, date, rate,amountDue });
        if (updatedMeter) {
            res.status(200).json(updatedMeter);
        } else {
            res.status(404).json({ error: 'Meter not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update meter: ${error.message}` });
    }
};

const deleteMeter = async (req, res) => {
    const { meterIds } = req.body;
    if (!Array.isArray(meterIds) || meterIds.length === 0) {
        return res.status(400).json({ error: 'meterIds should be a non-empty array' });
    }

    try {

        const deleteResults = await Promise.all(
            meterIds.map(async (id) => {
                return await meterService.del(id);
            })
        );

        const failedDeletes = meterIds.filter((id, index) => !deleteResults[index]);
        if (failedDeletes.length > 0) {
            return res.status(404).json({ error: `Meters not found: ${failedDeletes.join(', ')}` });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: `Failed to delete meters: ${error.message}` });
    }
};


const getMetersByHouse = async (req, res) => {
    const { houseId } = req.params;

    try {
        const meters = await meterService.getMetersByHouse(houseId);
        res.status(200).json(meters);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve meters for building: ${error.message}` });
    }
};

const ApproveToPay = async (req, res) => {
    const { apartmentId, meterIds } = req.body;
    try {
        if (!Array.isArray(meterIds) || meterIds.length === 0) {
            return res.status(400).json({ error: "Please provide an array of meter IDs" });
        }

        const meters = [];
        const alreadyApproved = [];

        for (const id of meterIds) {
            const meter = await meterService.get(id);
            if (!meter) {
                return res.status(404).json({ error: `Meter with ID ${id} not found` });
            }
            if (meter.toPay === true) {
                alreadyApproved.push(id);
            } else {
                meters.push(meter);
            }
        }

        if (meters.length === 0) {
            return res.status(400).json({
                error: "All selected meters are already approved for payment",
                alreadyApproved,
            });
        }

        const paymentResults = [];

        for (const meter of meters) {
            meter.toPay = true;
            await meter.save();

            const balanceResult = await BalanceAdd({
                apartmentId,
                meterType: meter.meterType,
                sum: meter.amountDue,
            });

            paymentResults.push(balanceResult);
        }

        res.status(200).json({
            message: "Meter payments approved and created successfully",
            paymentResults,
            alreadyApproved,
        });
    } catch (error) {
        console.error("Error processing payment approval:", error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};



module.exports = { getAllMeters, getMeter, getMetersByApartment, createMeter, updateMeter, deleteMeter, getMetersByHouse,ApproveToPay   };
