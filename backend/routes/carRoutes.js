const express = require('express');
const { listCars } = require('../controllers/carController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize(['admin']), listCars);

module.exports = router;
