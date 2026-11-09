const mongoose = require('mongoose');

const { parseDateRange } = require('../common/dates');
const { text } = require('../common/text');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Location = require('../models/Location');

const { STATUS, TAGS } = Car;

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

  // Location - one existing location is required
  const locationId = car.location;
  if (!locationId || !mongoose.Types.ObjectId.isValid(locationId)) {
    return { error: { message: 'A valid location is required', field: 'location' } };
  }
  const location = await Location.findById(locationId);
  if (!location) {
    return { error: { message: 'Location not found', field: 'location' } };
  }

  // Tags - resolve tags to empty array if not an array or contains invalid tags
  const tags = car.tags ?? [];
  if (!Array.isArray(tags) || tags.some((tag) => !TAGS.includes(tag))) {
    return { error: { message: 'Invalid tag', field: 'tags' } };
  }

  // Status - resolve status to 'Active' if not a valid status
  const status = car.status || 'Active';
  if (!STATUS.includes(status)) {
    return { error: { message: 'Status must be Active or Retired', field: 'status' } };
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
      status,
    },
  };
};

const findAvailableCars = async (req, res) => {
  const { location, start, end } = req.query;
  if (!location || !mongoose.Types.ObjectId.isValid(location)) {
    return res.status(400).json({ message: 'A valid location is required' });
  }

  const dates = parseDateRange(start, end);
  if (dates.error) return res.status(400).json({ message: dates.error });

  try {
    // Active car ids at this location
    const carsAtLocation = await Car.find({ location, status: 'Active' }).select('_id');

    // Car ids with a confirmed booking that overlaps the requested range
    const bookedCars = await Booking.find({
      car: { $in: carsAtLocation.map((car) => car._id) },
      status: 'Confirmed',
      startDate: { $lte: dates.endDate },
      endDate: { $gte: dates.startDate },
    }).distinct('car');

    // Get available (active) cars at this location where not in booked cars list
    const avaialbleCars = await Car.find({
      location,
      status: 'Active',
      _id: { $nin: bookedCars },
    })
      .populate('location', 'code name')
      .sort({ make: 1, model: 1 });

    res.json(avaialbleCars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listCars = async (req, res) => {
  try {
    const cars = await Car.find().populate('location', 'code name').sort({ make: 1, model: 1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ tags: 'featured', status: 'Active' })
      .populate('location', 'code name')
      .sort({ make: 1, model: 1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCar = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid car id' });
  }

  try {
    const car = await Car.findById(id).populate('location', 'code name');
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
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

const updateCar = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid car id' });
  }

  const parsedCar = await parseCar(req.body);
  if (parsedCar.error) return res.status(400).json(parsedCar.error);

  try {
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const regoTaken = await Car.findOne({ rego: parsedCar.values.rego });
    if (regoTaken && regoTaken.id !== car.id) {
      return res.status(400).json({
        message: 'A car with this rego already exists',
        field: 'rego',
        value: parsedCar.values.rego,
      });
    }
    Object.assign(car, parsedCar.values);

    await car.save();
    await car.populate('location', 'code name');
    res.json(car);
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

module.exports = {
  listCars,
  listFeaturedCars,
  getCar,
  createCar,
  updateCar,
  listTags,
  findAvailableCars,
};
