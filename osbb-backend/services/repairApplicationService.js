const RepairApplication = require("../models/repairApplication");
const {User, Apartment, House} = require("../models/associations");

const getAll = async () => {
    return await RepairApplication.findAll();
};

const get = async (id) => {
    return await RepairApplication.findByPk(id, {
        include:[{
            model: Apartment,
            attributes:["userId"]
        }]
    });
};

const getByApartment = async (apartmentId) => {
    return await RepairApplication.findAll({ where: { apartmentId } });
};


const getByOsbb = async (osbbId) => {
    console.log(RepairApplication.associations);
    return await RepairApplication.findAll({
        include: [
            {
                        model: Apartment,
                        attributes: ["id", "number", "userId"],
                        include: [
                            {
                                model: House,
                                attributes: ["id", "address"],
                                where: {osbbId },
                            },
                        ],
                required: true,
            },
        ],
    });
};

const add = async (applicationData) => {
    const { apartmentId, title, description, image } = applicationData;
    return await RepairApplication.create({ apartmentId, title, description, image });
};

const update = async (id, applicationData) => {
    const { title, description, status, image } = applicationData;
    const application = await RepairApplication.findByPk(id);

    if (application) {
        application.title = title || application.title;
        application.description = description || application.description;
        application.status = status || application.status;
        application.image = image || application.image;

        await application.save();
        return application;
    }
    return null;
};

const del = async (id) => {
    const application = await RepairApplication.findByPk(id);
    if (application) {
        await application.destroy();
        return true;
    }
    return false;
};

module.exports = { getAll, get, getByApartment, add, update, del, getByOsbb };
