const { Sequelize } = require('sequelize');
const houseService = require('../services/houseService');
const OSBB = require('../models/Osbb');


const getAllHouses = async (req, res) => {
    try {
        const houses = await houseService.getAll();
        res.status(200).json(houses);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve houses: ${error.message}` });
    }
};

const getHouse = async (req, res) => {
    const { id } = req.params;
    try {
        const house = await houseService.get(id);
        if (house) {
            res.status(200).json(house);
        } else {
            res.status(404).json({ error: 'House not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get house: ${error.message}` });
    }
};

const getHousesByOSBB = async (req, res) => {
    const { osbbId } = req.params;
    try {
        const houses = await houseService.getByOSBB(osbbId);
        res.status(200).json(houses);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve houses for OSBB: ${error.message}` });
    }
};

const getHouseByResidentId = async (req, res) => {
    const { residentId } = req.params;
    try {
        const house = await houseService.getByResidentId(residentId);
        res.status(200).json(house);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve house by residentId: ${error.message}` });
    }
};

const createHouse = async (req, res) => {
    const { osbbId, address, entNum, floorNum, appartNum, image } = req.body;
    const osbbExists = await OSBB.findByPk(osbbId);
    if (!osbbExists) {
        return res.status(400).json({ error: "OSBB with the given ID does not exist" });
    }
    try {
        const newHouse = await houseService.add({ osbbId, address, entNum, floorNum, appartNum, image });
        res.status(201).json(newHouse);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ error: `House already exists: ${error.message}` });
        } else {
            res.status(500).json({ error: `Server error: ${error.message}` });
        }
    }
};

const updateHouse = async (req, res) => {
    const { id } = req.params;
    const { osbbId, address, entNum, floorNum, appartNum, image } = req.body;
    try {
        const updatedHouse = await houseService.update(id, { osbbId, address, entNum, floorNum, appartNum, image });
        if (updatedHouse) {
            res.status(200).json(updatedHouse);
        } else {
            res.status(404).json({ error: 'House not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update house: ${error.message}` });
    }
};

const deleteHouse = async (req, res) => {
    const { id } = req.params;
    try {
        if (await houseService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'House not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete house: ${error.message}` });
    }
};

module.exports = { getAllHouses, getHouse, getHousesByOSBB, createHouse, updateHouse, deleteHouse, getHouseByResidentId  };
