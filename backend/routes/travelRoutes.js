const express = require('express');
const router = express.Router();
const {
    getTravelServices,
    getTravelServiceById,
    createTravelService,
    updateTravelService,
    deleteTravelService,
    getTravelDataForChatbot
} = require('../controllers/travelController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTravelServices);
router.get('/chatbot/data', getTravelDataForChatbot);
router.get('/:id', getTravelServiceById);

// Admin routes
router.post('/', protect, admin, createTravelService);
router.put('/:id', protect, admin, updateTravelService);
router.delete('/:id', protect, admin, deleteTravelService);

module.exports = router;
