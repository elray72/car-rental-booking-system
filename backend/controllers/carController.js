const mongoose = require('mongoose');
const Car = require('../models/Car');

const listCars = async (req, res) => {
  try {
    const cars = await Car.find().populate('location', 'code name').sort({ make: 1, model: 1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listCars };
