const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.join('./data', 'osbb.db');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    retry: {
        match: [/SQLITE_BUSY/],
        max: 5
    }
});

module.exports = sequelize;
