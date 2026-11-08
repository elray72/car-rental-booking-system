const express = require('express');
const {
  listLocations,
  createLocation,
  getLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listLocations);
router.post('/', protect, authorize(['admin']), createLocation);
router.get('/:id', protect, authorize(['admin']), getLocation);
router.put('/:id', protect, authorize(['admin']), updateLocation);
router.delete('/:id', protect, authorize(['admin']), deleteLocation);

module.exports = router;
