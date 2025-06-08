const Resident = require("../models/Resident");
const { Sequelize } = require('sequelize');
const crypto = require('crypto');



const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32);
const iv = Buffer.alloc(16, 0);

const encrypt = (text) => {
    if (!text) return null;
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decrypt = (encrypted) => {
    if (!encrypted) return null;
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};


const getAll = async () => {
    const residents = await Resident.findAll();
    return residents.map(resident => ({
        ...resident.dataValues,
        fullname: decrypt(resident.fullname),
        passportData: decrypt(resident.passportData),
        taxNum: decrypt(resident.taxNum),
    }));
};

const get = async (id) => {
    const resident = await Resident.findByPk(id);
    if (resident) {
        resident.fullname = decrypt(resident.fullname);
        resident.passportData = decrypt(resident.passportData);
        resident.taxNum = decrypt(resident.taxNum);
    }
    return resident;
};

const getByApartment = async (apartmentId) => {
    const residents = await Resident.findAll({ where: { apartmentId } });
    return residents.map(resident => ({
        ...resident.dataValues,
        fullname: decrypt(resident.fullname),
        passportData: decrypt(resident.passportData),
        taxNum: decrypt(resident.taxNum),
    }));
};

const getByApartments = async (apartmentIds) => {
    const residents = await Resident.findAll({
        where: {
            apartmentId: {
                [Sequelize.Op.in]: apartmentIds
            }
        }
    });
    return residents.map(resident => ({
        ...resident.dataValues,
        fullname: decrypt(resident.fullname),
        passportData: decrypt(resident.passportData),
        taxNum: decrypt(resident.taxNum),
    }));
};

const add = async (residentData) => {
    const { apartmentId, fullname, birthDate, passportData, taxNum } = residentData;

    return await Resident.create({
        apartmentId,
        fullname: encrypt(fullname),
        birthDate,
        passportData: encrypt(passportData),
        taxNum: encrypt(taxNum)
    });
};

const update = async (id, residentData) => {
    const { apartmentId, fullname, birthDate, passportData, taxNum } = residentData;
    const resident = await Resident.findByPk(id);

    if (resident) {
        resident.apartmentId = apartmentId || resident.apartmentId;
        resident.fullname = fullname ? encrypt(fullname) : resident.fullname;
        resident.birthDate = birthDate || resident.birthDate;
        resident.passportData = passportData ? encrypt(passportData) : resident.passportData;
        resident.taxNum = taxNum ? encrypt(taxNum) : resident.taxNum;

        await resident.save();
        return resident;
    }
    return null;
};

const del = async (id) => {
    const resident = await Resident.findByPk(id);
    if (resident) {
        await resident.destroy();
        return true;
    }
    return false;
};



module.exports = { getAll, get, getByApartment, add, update, del, getByApartments };
