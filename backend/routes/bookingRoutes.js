const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes (all protected)
router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/admin/all', protect, admin, getAllBookings);
router.put('/admin/:id', protect, admin, updateBookingStatus);

module.exports = router;
