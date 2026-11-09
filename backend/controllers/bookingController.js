const mongoose = require('mongoose');

const { parseDateRange } = require('../common/dates');
const Booking = require('../models/Booking');
const Car = require('../models/Car');

const createBooking = async (req, res) => {
  const carId = req.body.car;
  if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
    return res.status(400).json({ message: 'A valid car is required to create a booking' });
  }

  const dates = parseDateRange(req.body.startDate, req.body.endDate);
  if (dates.error) return res.status(400).json({ message: dates.error });

  try {
    const car = await Car.findOne({ _id: carId, status: 'Active' });
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const existingBooking = await Booking.findOne({
      car: carId,
      status: 'Confirmed',
      startDate: { $lte: dates.endDate },
      endDate: { $gte: dates.startDate },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'This car is not available for the selected dates',
      });
    }

    const booking = await Booking.create({
      owner: req.user._id,
      car: carId,
      startDate: dates.startDate,
      endDate: dates.endDate,
      status: 'Confirmed',
    });

    await booking.populate({
      path: 'car',
      populate: {
        path: 'location',
        select: 'code name',
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid booking id' });
  }

  try {
    const booking = await Booking.findById(id).populate({
      path: 'car',
      populate: { path: 'location', select: 'code name' },
    });

    if (!booking || String(booking.owner) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBooking };
