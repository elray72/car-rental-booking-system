const express = require('express');
const { listCars } = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize(['admin']), listCars);

module.exports = router;
