const express = require('express');
const router = express.Router();
const {
    searchFlights,
    getAirports,
    getSupportedCities,
    getPriceAnalysis
} = require('../controllers/flightController');

// Public routes
router.get('/search', searchFlights);
router.get('/airports', getAirports);
router.get('/cities', getSupportedCities);
router.get('/price-analysis', getPriceAnalysis);

module.exports = router;
