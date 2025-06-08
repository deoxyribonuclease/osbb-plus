const { Sequelize } = require('sequelize');
const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve users: ${error.message}` });
    }
};

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.get(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get user: ${error.message}` });
    }
};


const getAccountantsWithHierarchy = async (req, res) => {
    try {
        const accountants = await userService.getAccountantsWithHierarchy();
        res.status(200).json(accountants);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve accountants: ${error.message}` });
    }
};



const updateUser = async (req, res) => {
    const { id } = req.params;
    const { login, password, role, phone, email } = req.body;
    try {
        const updatedUser = await userService.update(id, { login, password, role, phone, email });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update user: ${error.message}` });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (await userService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete user: ${error.message}` });
    }
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser, getAccountantsWithHierarchy  };
