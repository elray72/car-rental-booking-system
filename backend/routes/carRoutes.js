const express = require('express');
const {
  listCars,
  createCar,
  getCar,
  updateCar,
  listTags,
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Tags
router.get('/tags', listTags);

// Cars
router.get('/', protect, authorize(['staff', 'admin']), listCars);
router.post('/', protect, authorize(['admin']), createCar);
router.get('/:id', protect, authorize(['admin']), getCar);
router.put('/:id', protect, authorize(['admin']), updateCar);

module.exports = router;
