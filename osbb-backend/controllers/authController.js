const { Sequelize } = require('sequelize');
const authService = require("../services/authService");
const userService = require('../services/userService');

const registerUser = async (req, res) => {
    const { login, password, role, phone, email, osbbName } = req.body;
    try {
        const newUser = await userService.add({ login, password, role, phone, email, osbbName });
        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ error: `User already exists: ${error.message}` });
        } else {
            res.status(500).json({ error: `Server error: ${error.message}` });
        }
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (result.token) {
        res.status(200).json(result);
    } else {
        res.status(401).json(result);
    }
};

module.exports = { registerUser, loginUser };
