const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService')
const { jwtSecret } = require('../config');

const register = async (email, password, name) => {
    try {
        const user = await userService.getByEmail(email);
        if (user) {
            return { error: "User already exists" };
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        await userService.add({ email, password: passwordHashed, name });

        return { message: "User registered successfully" };
    } catch (error) {
        return { error: `Server error: ${error.message}` };
    }
};

const login = async (email, password) => {
    try {
        const user = await userService.getByEmail(email);
        if (!user) {
            return { error: "Invalid credentials" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { error: "Wrong password" };
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
        return { token };
    } catch (error) {
        return { error: `Server error: ${error.message}` };
    }
};

module.exports = { register, login };
