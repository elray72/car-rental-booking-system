const express = require('express');

const { createBooking, getMyBookings, getBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);
router.get('/:id', protect, getBooking);

module.exports = router;
