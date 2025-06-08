const Meter = require("../models/Meter");
const Apartment = require("../models/Apartment");


const getAll = async () => {
    return await Meter.findAll();
};

const get = async (id) => {
    return await Meter.findByPk(id);
};

const getByApartment = async (apartmentId) => {
    return await Meter.findAll({ where: { apartmentId } });
};

const getLastMeterByApartment = async (apartmentId, meterType) => {
    return await Meter.findOne({
        where: { apartmentId, meterType },
        order: [['createdAt', 'DESC']]
    });
};

const add = async ({ apartmentId, currIndicators, consumption, meterType, date, rate, prevIndicators }) => {
    const prevIndicatorsValue =  prevIndicators;
    const actualConsumption = meterType === "Утримання будинку" ? consumption : (consumption ?? (currIndicators - prevIndicatorsValue));

    const amountDue = (rate !== undefined && rate !== null) ? actualConsumption * rate : null;

    return await Meter.create({
        apartmentId,
        prevIndicators: prevIndicatorsValue,
        currIndicators,
        consumption: actualConsumption,
        meterType,
        date,
        rate,
        amountDue,
    });
};




const update = async (id, meterData) => {
    const meter = await Meter.findByPk(id);
    if (!meter) return null;

    console.log("Отримані дані meterData:", meterData);

    meter.apartmentId = meterData.apartmentId ?? meter.apartmentId;
    meter.prevIndicators = meterData.prevIndicators ?? meter.prevIndicators;
    meter.currIndicators = meterData.currIndicators ?? meter.currIndicators;
    meter.meterType = meterData.meterType ?? meter.meterType;
    meter.date = meterData.date ?? meter.date;
    meter.rate = meterData.rate ?? meter.rate;

    if(meterData.meterType === "Утримання будинку")
        meter.consumption=meter.currIndicators;
    else
    meter.consumption = meter.currIndicators - meter.prevIndicators;
    meter.amountDue = meter.consumption * meter.rate;

    await meter.save();
    console.log("Оновлений meter:", meter.toJSON());
    return meter;
};



const del = async (id) => {
    const meter = await Meter.findByPk(id);
    if (!meter) return false;

    await meter.destroy();
    return true;
};

const getMetersByHouse  = async (houseId) => {
    const apartments = await Apartment.findAll({ where: { houseId } });
    if (!apartments || apartments.length === 0) {
        throw new Error('No apartments found for the given building');
    }
    const meters = [];
    for (let apartment of apartments) {
        const apartmentMeters = await Meter.findAll({ where: { apartmentId: apartment.id } });
        meters.push(...apartmentMeters);
    }
    return meters;
};


module.exports = { getAll, get, getByApartment, getLastMeterByApartment, add, update, del, getMetersByHouse    };
