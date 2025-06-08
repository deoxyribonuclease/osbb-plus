
const Apartment = require('../models/Apartment');
const House = require('../models/House');


const getAll = async () => {
    return await House.findAll();
};

const get = async (id) => {
    return await House.findByPk(id);
};

const getByOSBB = async (osbbId) => {
    return await House.findAll({ where: { osbbId } });
};

const getByResidentId = async (residentId) => {
    return await House.findOne({
        include: [
            {
                model: Apartment,
                where: { userId: residentId },
                required: true
            }
        ]
    });

};

const add = async (houseData) => {
    const { osbbId, address, entNum, floorNum, appartNum, image } = houseData;
    return await House.create({ osbbId, address, entNum, floorNum, appartNum, image });
};

const update = async (id, houseData) => {
    const { osbbId, address, entNum, floorNum, appartNum, image } = houseData;
    const house = await House.findByPk(id);
    if (house) {
        house.osbbId = osbbId || house.osbbId;
        house.address = address || house.address;
        house.entNum = entNum || house.entNum;
        house.floorNum = floorNum || house.floorNum;
        house.appartNum = appartNum || house.appartNum;
        house.image = image !== undefined ? image : house.image;

        await house.save();
        return house;
    }
    return null;
};

const del = async (id) => {
    const house = await House.findByPk(id);
    if (house) {
        await house.destroy();
        return true;
    }
    return false;
};

module.exports = { getAll, get, getByOSBB,getByResidentId, add, update, del };
