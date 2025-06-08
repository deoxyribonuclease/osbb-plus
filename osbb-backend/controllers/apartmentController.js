const { Sequelize } = require('sequelize');
const apartmentService = require('../services/apartmentService');
const userService = require('../services/userService');
const House = require('../models/House');

const getAllApartments = async (req, res) => {
    try {
        const apartments = await apartmentService.getAll();
        res.status(200).json(apartments);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve apartments: ${error.message}` });
    }
};

const getApartment = async (req, res) => {
    const { id } = req.params;
    try {
        const apartment = await apartmentService.get(id);
        if (apartment) {
            res.status(200).json(apartment);
        } else {
            res.status(404).json({ error: 'Apartment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get apartment: ${error.message}` });
    }
};

const getApartmentsByHouse = async (req, res) => {
    const { houseId } = req.params;
    try {
        const apartments = await apartmentService.getByHouse(houseId);
        res.status(200).json(apartments);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve apartments for house: ${error.message}` });
    }
};

const getApartmentsByResidentId = async (req, res) => {
    const { residentId } = req.params;
    try {
        const apartments = await apartmentService.getByResidentId(residentId);
        res.status(200).json(apartments);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve apartments for house: ${error.message}` });
    }
};


const createApartment = async (req, res) => {
    const { houseId, userId, area, number, roomNum } = req.body;
    const houseExists = await House.findByPk(houseId);

    if (!houseExists) {
        return res.status(400).json({ error: "House with the given ID does not exist" });
    }

    try {
        const newApartment = await apartmentService.add({ houseId, userId, area, number, roomNum });
        res.status(201).json(newApartment);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ error: `Apartment already exists: ${error.message}` });
        } else {
            res.status(500).json({ error: `Server error: ${error.message}` });
        }
    }
};

const createResidentAccountToApartment = async (req, res) => {
    const { apartmentId } = req.params;
    const { login, password, phone, email, osbbName } = req.body;

    try {
        const newUser = await userService.add({ login, password, role: 'Resident', phone, email, osbbName });

        const updatedApartment = await apartmentService.update(apartmentId, { userId: newUser.id });

        if (updatedApartment) {
            res.status(201).json({
                message: 'Resident account created and apartment updated successfully',
                user: newUser,
                apartment: updatedApartment
            });
        } else {
            res.status(404).json({ error: 'Apartment not found' });
        }
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ error: `User already exists: ${error.message}` });
        } else {
            res.status(500).json({ error: `Server error: ${error.message}` });
        }
    }
};

const updateApartment = async (req, res) => {
    const { id } = req.params;
    const { houseId, userId, area, number, roomNum } = req.body;

    try {
        const updatedApartment = await apartmentService.update(id, { houseId, userId, area, number, roomNum });
        if (updatedApartment) {
            res.status(200).json(updatedApartment);
        } else {
            res.status(404).json({ error: 'Apartment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update apartment: ${error.message}` });
    }
};

const deleteApartment = async (req, res) => {
    const { id } = req.params;
    try {
        if (await apartmentService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Apartment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete apartment: ${error.message}` });
    }
};

module.exports = { getAllApartments, getApartment, getApartmentsByHouse, createApartment, updateApartment, deleteApartment,createResidentAccountToApartment,getApartmentsByResidentId };
