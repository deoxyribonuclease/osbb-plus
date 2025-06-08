const Apartment = require("../models/Apartment");

const getAll = async () => {
    return await Apartment.findAll();
};

const get = async (id) => {
    return await Apartment.findByPk(id);
};

const getByHouse = async (houseId) => {
    return await Apartment.findAll({ where: { houseId } });
};

const getByResidentId = async (residentId) => {
    return await Apartment.findAll({ where: { userId: residentId } });
};


const add = async (apartmentData) => {
    const { houseId, userId, area, number, roomNum } = apartmentData;
    return await Apartment.create({ houseId, userId, area, number, roomNum });
};

const update = async (id, apartmentData) => {
    const { houseId, userId, area, number, roomNum } = apartmentData;
    const apartment = await Apartment.findByPk(id);

    if (apartment) {
        apartment.houseId = houseId || apartment.houseId;
        apartment.userId = userId !== undefined ? userId : apartment.userId;
        apartment.area = area || apartment.area;
        apartment.number = number || apartment.number;
        apartment.roomNum = roomNum || apartment.roomNum;

        await apartment.save();
        return apartment;
    }
    return null;
};

const del = async (id) => {
    const apartment = await Apartment.findByPk(id);
    if (apartment) {
        await apartment.destroy();
        return true;
    }
    return false;
};

module.exports = { getAll, get, getByHouse, add, update, del,getByResidentId };
