const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const OSBB = require('./Osbb');
const Apartment = require('./Apartment');

const House = sequelize.define('House', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  osbbId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Osbbs',
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entNum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  floorNum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  appartNum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});



module.exports = House;
