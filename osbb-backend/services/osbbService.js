const OSBB = require("../models/Osbb");
const House = require("../models/House");
const Apartment = require("../models/Apartment");

const getAll = async () => {
    return await OSBB.findAll();
};

const get = async (id) => {
    return await OSBB.findByPk(id);
};

const getByUserId = async (userId) => {
    return await OSBB.findAll({ where: { userId } });
};

const getByResidentId = async (residentId) => {
    return await OSBB.findOne({
        include: [
            {
                model: House,
                include: [
                    {
                        model: Apartment,
                        where: { userId: residentId },
                        required: true
                    }
                ],
                required: true
            }
        ]
    });
};



const add = async (osbbData) => {
    const { name, address, contact, details, creationDate, status, userId } = osbbData;
    return await OSBB.create({ name, address, contact, details, creationDate, status, userId });
};

const update = async (id, osbbData) => {
    const { name, address, contact, details, creationDate, status, userId } = osbbData;
    const osbb = await OSBB.findByPk(id);
    if (osbb) {
        osbb.name = name || osbb.name;
        osbb.address = address || osbb.address;
        osbb.contact = contact || osbb.contact;
        osbb.details = details || osbb.details;
        osbb.creationDate = creationDate || osbb.creationDate;
        osbb.status = status || osbb.status;
        osbb.userId = userId || osbb.userId;

        await osbb.save();
        return osbb;
    }
    return null;
};

const del = async (id) => {
    const osbb = await OSBB.findByPk(id);
    if (osbb) {
        await osbb.destroy();
        return true;
    }
    return false;
};

module.exports = { getAll, get, add, update, del, getByUserId, getByResidentId };
