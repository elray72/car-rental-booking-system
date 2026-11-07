const mongoose = require('mongoose');
const Car = require('../models/Car');

const listCars = async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listCars };
