const User = require('../models/User');
const Booking = require('../models/Booking');
const TravelService = require('../models/TravelService');
const Review = require('../models/Review');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalServices = await TravelService.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Booking stats
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Revenue calculation
    const revenueData = await Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Recent bookings
    const recentBookings = await Booking.find()
        .populate('user', 'name email')
        .populate('travelService', 'name type')
        .sort({ createdAt: -1 })
        .limit(5);

    // Popular services
    const popularServices = await TravelService.find({ isActive: true })
        .sort({ reviewCount: -1, rating: -1 })
        .limit(5)
        .select('name type destination rating reviewCount price');

    res.json({
        success: true,
        data: {
            stats: {
                totalUsers,
                totalServices,
                totalBookings,
                totalReviews,
                totalRevenue,
                confirmedBookings,
                cancelledBookings,
                pendingBookings
            },
            recentBookings,
            popularServices
        }
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search } = req.query;

    let query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    res.json({
        success: true,
        data: users,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total
        }
    });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        res.status(400);
        throw new Error('Invalid role');
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
    ).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        success: true,
        data: user
    });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin user');
    }

    await user.deleteOne();

    res.json({
        success: true,
        message: 'User deleted'
    });
});

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser
};
