const express = require('express');
const { listCars, createCar, listTags } = require('../controllers/carController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize(['admin']), listCars);
router.post('/', protect, authorize(['admin']), createCar);
router.get('/tags', protect, authorize(['admin']), listTags);

module.exports = router;
