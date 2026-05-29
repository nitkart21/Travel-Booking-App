const Review = require('../models/Review');
const TravelService = require('../models/TravelService');
const Booking = require('../models/Booking');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { travelServiceId, rating, title, comment } = req.body;

    // Check if service exists
    const service = await TravelService.findById(travelServiceId);
    if (!service) {
        res.status(404);
        throw new Error('Travel service not found');
    }

    // Check if user has booked this service
    const hasBooked = await Booking.findOne({
        user: req.user._id,
        travelService: travelServiceId,
        status: { $in: ['confirmed', 'completed'] }
    });

    if (!hasBooked) {
        res.status(400);
        throw new Error('You can only review services you have booked');
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
        user: req.user._id,
        travelService: travelServiceId
    });

    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this service');
    }

    // Create review
    const review = await Review.create({
        user: req.user._id,
        travelService: travelServiceId,
        rating,
        title,
        comment
    });

    const populatedReview = await Review.findById(review._id)
        .populate('user', 'name');

    res.status(201).json({
        success: true,
        data: populatedReview
    });
});

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
const getServiceReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Review.countDocuments({ travelService: req.params.serviceId });
    const reviews = await Review.find({ travelService: req.params.serviceId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    res.json({
        success: true,
        data: reviews,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total
        }
    });
});

// @desc    Get user's reviews
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
        .populate('travelService', 'name type destination')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: reviews
    });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    const { rating, title, comment } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this review');
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;

    await review.save();

    res.json({
        success: true,
        data: review
    });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();

    res.json({
        success: true,
        message: 'Review deleted'
    });
});

module.exports = {
    createReview,
    getServiceReviews,
    getMyReviews,
    updateReview,
    deleteReview
};
