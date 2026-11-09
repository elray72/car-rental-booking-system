const express = require('express');
const {
  findAvailableCars,
  listCars,
  listFeaturedCars,
  createCar,
  getCar,
  updateCar,
  listTags,
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/available', findAvailableCars);
router.get('/featured', listFeaturedCars);
router.get('/tags', listTags);

// Protected
router.get('/', protect, authorize(['staff', 'admin']), listCars);
router.post('/', protect, authorize(['admin']), createCar);
router.get('/:id', protect, authorize(['admin']), getCar);
router.put('/:id', protect, authorize(['admin']), updateCar);

module.exports = router;
