const { Sequelize } = require('sequelize');
const residentService = require('../services/residentService');
const Apartment = require('../models/apartment');

const getAllResidents = async (req, res) => {
    try {
        const residents = await residentService.getAll();
        res.status(200).json(residents);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve residents: ${error.message}` });
    }
};

const getResident = async (req, res) => {
    const { id } = req.params;
    try {
        const resident = await residentService.get(id);
        if (resident) {
            res.status(200).json(resident);
        } else {
            res.status(404).json({ error: 'Resident not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get resident: ${error.message}` });
    }
};

const getResidentsByApartment = async (req, res) => {
    const { apartmentId } = req.params;
    try {
        const residents = await residentService.getByApartment(apartmentId);
        res.status(200).json(residents);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve residents for apartment: ${error.message}` });
    }
};

const getResidentsByHouse = async (req, res) => {
    const { houseId } = req.params;
    try {
        const apartments = await Apartment.findAll({ where: { houseId } });

        if (!apartments.length) {
            return res.status(404).json({ error: 'No apartments found for this house' });
        }

        const apartmentIds = apartments.map(apartment => apartment.id);
        const residents = await residentService.getByApartments(apartmentIds);

        res.status(200).json(residents);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve residents: ${error.message}` });
    }
};


const createResident = async (req, res) => {
    const { apartmentId, fullname, birthDate, passportData, taxNum } = req.body;
    const apartmentExists = await Apartment.findByPk(apartmentId);

    if (!apartmentExists) {
        return res.status(400).json({ error: "Apartment with the given ID does not exist" });
    }

    try {
        const newResident = await residentService.add({ apartmentId, fullname, birthDate, passportData, taxNum });
        res.status(201).json(newResident);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ error: `Resident already exists: ${error.message}` });
        } else {
            res.status(500).json({ error: `Server error: ${error.message}` });
        }
    }
};

const updateResident = async (req, res) => {
    const { id } = req.params;
    const { apartmentId, fullname, birthDate, passportData, taxNum } = req.body;

    try {
        const updatedResident = await residentService.update(id, { apartmentId, fullname, birthDate, passportData, taxNum });
        if (updatedResident) {
            res.status(200).json(updatedResident);
        } else {
            res.status(404).json({ error: 'Resident not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update resident: ${error.message}` });
    }
};

const deleteResident = async (req, res) => {
    const { id } = req.params;
    try {
        if (await residentService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Resident not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete resident: ${error.message}` });
    }
};

module.exports = { getAllResidents, getResident, getResidentsByApartment, createResident, updateResident, deleteResident,getResidentsByHouse };
