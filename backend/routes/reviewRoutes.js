const express = require('express');
const router = express.Router();
const {
    createReview,
    getServiceReviews,
    getMyReviews,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/service/:serviceId', getServiceReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/my', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
