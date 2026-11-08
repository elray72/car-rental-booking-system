const mongoose = require('mongoose');
const Location = require('../models/Location');
const { validateRequiredFields } = require('../common/validation');

const listLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLocation = async (req, res) => {
  const { name, code, address } = req.body;
  if (!validateRequiredFields({ name, code, address })) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const locationExists =
      (await Location.findOne({ name: name.trim() })) ||
      (await Location.findOne({ code: code.trim().toUpperCase() }));
    if (locationExists) {
      return res.status(409).json({ message: 'Location already exists' });
    }

    const location = await Location.create({
      name: name.trim(),
      code,
      address: address.trim(),
    });
    res.status(201).json(location);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Location already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

const getLocation = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid location id' });
  }

  try {
    const location = await Location.findById(id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, code, address } = req.body;
  if (!validateRequiredFields({ name, code, address })) {
    return res.status(400).json({ message: 'One or more required fields do not have a value' });
  }

  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Ensure location code is unique
    const codeExists = await Location.findOne({ code: code.trim().toUpperCase() });
    if (codeExists && codeExists.id !== location.id) {
      return res.status(409).json({ message: 'Location code already exists' });
    }

    location.name = name.trim();
    location.code = code.trim().toUpperCase();
    location.address = address.trim();

    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLocation = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid location ID' });
  }

  try {
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listLocations, getLocation, createLocation, updateLocation, deleteLocation };
