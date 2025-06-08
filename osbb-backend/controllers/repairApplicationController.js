const repairApplicationService = require('../services/repairApplicationService');
const {Apartment, RepairApplication} = require("../models/associations");

const getAllApplications = async (req, res) => {
    try {
        const applications = await repairApplicationService.getAll();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve repair applications: ${error.message}` });
    }
};

const getApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const application = await repairApplicationService.get(id);
        if (application) {
            res.status(200).json(application);
        } else {
            res.status(404).json({ error: 'Repair application not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get repair application: ${error.message}` });
    }
};

const getApplicationsByApartment = async (req, res) => {
    const { apartmentId } = req.params;
    try {
        const applications = await repairApplicationService.getByApartment(apartmentId);
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve repair applications for user: ${error.message}` });
    }
};

const getApplicationsByOsbb = async (req, res) => {
    const { osbbId } = req.params;
    try {
        console.log(RepairApplication.associations)
        const applications = await repairApplicationService.getByOsbb(osbbId);
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve repair applications: ${error.message}` });
    }
};

const createApplication = async (req, res) => {
    const { apartmentId, title, description, image } = req.body;
    const apartmentExists = await Apartment.findByPk(apartmentId);

    if (!apartmentExists) {
        return res.status(400).json({ error: "User with the given ID does not exist" });
    }

    try {
        const newApplication = await repairApplicationService.add({ apartmentId, title, description, image });
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};

const updateApplication = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, image } = req.body;

    try {
        const updatedApplication = await repairApplicationService.update(id, { title, description, status, image });
        if (updatedApplication) {
            res.status(200).json(updatedApplication);
        } else {
            res.status(404).json({ error: 'Repair application not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update repair application: ${error.message}` });
    }
};

const deleteApplication = async (req, res) => {
    const { id } = req.params;
    try {
        if (await repairApplicationService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Repair application not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete repair application: ${error.message}` });
    }
};

module.exports = { getAllApplications, getApplication, getApplicationsByApartment, createApplication, updateApplication, deleteApplication,getApplicationsByOsbb };
