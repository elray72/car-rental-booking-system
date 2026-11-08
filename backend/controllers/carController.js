const mongoose = require('mongoose');
const Car = require('../models/Car');
const Location = require('../models/Location');

const { TAGS } = Car;

const parseCar = async (car) => {
  const nickname = text(car.nickname);
  const rego = text(car.rego).toUpperCase();
  const make = text(car.make);
  const model = text(car.model);
  const color = text(car.color);

  // Required fields check
  if (!nickname || !rego || !make || !model || !color) {
    return {
      error: {
        message: 'Please enter a valid value for Nickname, Rego, Make, Model, and Colour fields',
      },
    };
  }

  // Year - must be a valid whole number
  const year = Number(car.year);
  if (!Number.isInteger(year) || year <= 0) {
    return { error: { message: 'Please enter a valid year', field: 'year' } };
  }

  // Daily rate - resolve daily rate to 0 if not a valid number
  const dailyRate = Number(car.dailyRate);
  const resolvedDailyRate = Number.isFinite(dailyRate) ? dailyRate : 0;

  // Location - resolve location to null if not a valid object id
  const locationId = car.location || null;
  let location = null;
  if (locationId && mongoose.Types.ObjectId.isValid(locationId)) {
    location = await Location.findById(locationId);
  }
  if (locationId && !location) {
    return { error: { message: 'Location not found', field: 'location' } };
  }

  // Tags - resolve tags to empty array if not an array or contains invalid tags
  const tags = car.tags ?? [];
  if (!Array.isArray(tags) || tags.some((tag) => !TAGS.includes(tag))) {
    return { error: { message: 'Invalid tag', field: 'tags' } };
  }

  return {
    values: {
      nickname,
      rego,
      make,
      model,
      year,
      color,
      dailyRate: resolvedDailyRate,
      location: locationId,
      tags,
    },
  };
};

const listCars = async (req, res) => {
  try {
    const cars = await Car.find().populate('location', 'code name').sort({ make: 1, model: 1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCar = async (req, res) => {
  const parsedCar = await parseCar(req.body);
  if (parsedCar.error) return res.status(400).json(parsedCar.error);

  const isRegoUnique = await Car.findOne({ rego: parsedCar.values.rego });
  if (isRegoUnique) {
    return res.status(400).json({
      message: 'A car with this rego already exists',
      field: 'rego',
      value: parsedCar.values.rego,
    });
  }

  try {
    const car = await Car.create(parsedCar.values);
    await car.populate('location', 'code name');
    res.status(201).json(car);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A car with this rego already exists',
        field: 'rego',
        value: parsedCar.values.rego,
      });
    }
    res.status(500).json({ message: error.message });
  }
};

const listTags = (req, res) => {
  res.json(TAGS);
};

module.exports = { listCars, createCar, listTags };
