const Booking = require('../models/Booking');
const TravelService = require('../models/TravelService');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const {
        travelServiceId,
        travelDate,
        passengers,
        passengerDetails,
        contactEmail,
        contactPhone,
        paymentMethod,
        specialRequests
    } = req.body;

    // Get travel service
    const service = await TravelService.findById(travelServiceId);
    if (!service) {
        res.status(404);
        throw new Error('Travel service not found');
    }

    // Check availability
    if (service.availableSeats < passengers) {
        res.status(400);
        throw new Error(`Only ${service.availableSeats} seats available`);
    }

    // Calculate total amount
    const totalAmount = service.price * passengers;

    // Create booking
    const booking = await Booking.create({
        user: req.user._id,
        travelService: travelServiceId,
        travelDate,
        passengers,
        passengerDetails,
        totalAmount,
        contactEmail,
        contactPhone,
        paymentMethod,
        specialRequests,
        status: 'confirmed',
        paymentStatus: 'paid' // Simulated payment
    });

    // Update available seats
    service.availableSeats -= passengers;
    await service.save();

    // Populate and return booking
    const populatedBooking = await Booking.findById(booking._id)
        .populate('travelService', 'name type source destination price duration images');

    res.status(201).json({
        success: true,
        message: 'Booking confirmed! Confirmation sent to your email.',
        data: populatedBooking
    });
});

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user._id };
    if (status) query.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
        .populate('travelService', 'name type source destination price duration images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    res.json({
        success: true,
        data: bookings,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total
        }
    });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('travelService')
        .populate('user', 'name email phone');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this booking');
    }

    res.json({
        success: true,
        data: booking
    });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Check ownership
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status === 'cancelled') {
        res.status(400);
        throw new Error('Booking is already cancelled');
    }

    // Restore seats
    const service = await TravelService.findById(booking.travelService);
    if (service) {
        service.availableSeats += booking.passengers;
        await service.save();
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
        success: true,
        message: 'Booking cancelled successfully. Refund initiated.',
        data: booking
    });
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
        .populate('travelService', 'name type source destination')
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    res.json({
        success: true,
        data: bookings,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total
        }
    });
});

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/admin/:id
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    res.json({
        success: true,
        data: booking
    });
});

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    updateBookingStatus
};
