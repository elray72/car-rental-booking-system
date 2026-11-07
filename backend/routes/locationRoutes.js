const express = require('express');
const { listLocations } = require('../controllers/locationController');

const router = express.Router();

router.get('/', listLocations);

module.exports = router;
