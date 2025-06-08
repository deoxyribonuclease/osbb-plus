const { Sequelize } = require('sequelize');
const osbbService = require('../services/osbbService');

const getAllOSBBs = async (req, res) => {
    try {
        const osbbs = await osbbService.getAll();
        res.status(200).json(osbbs);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve OSBBs: ${error.message}` });
    }
};

const getOSBB = async (req, res) => {
    const { id } = req.params;
    try {
        const osbb = await osbbService.get(id);
        if (osbb) {
            res.status(200).json(osbb);
        } else {
            res.status(404).json({ error: 'OSBB not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get OSBB: ${error.message}` });
    }
};

const getOSBBsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const osbbs = await osbbService.getByUserId(userId);
        res.status(200).json(osbbs);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve OSBBs by userId: ${error.message}` });
    }
};

const getOSBBsByResidentId = async (req, res) => {
    const { residentId } = req.params;
    try {
        const osbbs = await osbbService.getByResidentId(residentId);
        res.status(200).json(osbbs);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve OSBBs by residentId: ${error.message}` });
    }
};


const createOSBB = async (req, res) => {
    const { name, address, contact, details, creationDate, status, userId } = req.body;
    try {
        const newOSBB = await osbbService.add({ name, address, contact, details, creationDate, status, userId });
        res.status(201).json(newOSBB);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ error: `OSBB already exists: ${error.message}` });
        } else {
            res.status(500).json({ error: `Server error: ${error.message}` });
        }
    }
};

const updateOSBB = async (req, res) => {
    const { id } = req.params;
    const { name, address, contact, details, creationDate, status, userId } = req.body;
    try {
        const updatedOSBB = await osbbService.update(id, { name, address, contact, details, creationDate, status, userId });
        if (updatedOSBB) {
            res.status(200).json(updatedOSBB);
        } else {
            res.status(404).json({ error: 'OSBB not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update OSBB: ${error.message}` });
    }
};

const deleteOSBB = async (req, res) => {
    const { id } = req.params;
    try {
        if (await osbbService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'OSBB not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete OSBB: ${error.message}` });
    }
};

module.exports = { getAllOSBBs, getOSBB, createOSBB, updateOSBB, deleteOSBB,getOSBBsByUserId,getOSBBsByResidentId   };
