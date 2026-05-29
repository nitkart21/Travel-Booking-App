const TravelService = require('../models/TravelService');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all travel services with filters
// @route   GET /api/travel
// @access  Public
const getTravelServices = asyncHandler(async (req, res) => {
    const {
        type,
        source,
        destination,
        minPrice,
        maxPrice,
        date,
        sort,
        page = 1,
        limit = 10,
        search
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (type) query.type = type;
    if (source) query.source = { $regex: source, $options: 'i' };
    if (destination) query.destination = { $regex: destination, $options: 'i' };
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (date) {
        const searchDate = new Date(date);
        query.departureDate = {
            $gte: new Date(searchDate.setHours(0, 0, 0)),
            $lte: new Date(searchDate.setHours(23, 59, 59))
        };
    }
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { source: { $regex: search, $options: 'i' } },
            { destination: { $regex: search, $options: 'i' } }
        ];
    }

    // Sorting
    let sortOption = {};
    if (sort === 'price_low') sortOption.price = 1;
    else if (sort === 'price_high') sortOption.price = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else sortOption.createdAt = -1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await TravelService.countDocuments(query);
    const services = await TravelService.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum);

    res.json({
        success: true,
        data: services,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            hasMore: pageNum * limitNum < total
        }
    });
});

// @desc    Get single travel service
// @route   GET /api/travel/:id
// @access  Public
const getTravelServiceById = asyncHandler(async (req, res) => {
    const service = await TravelService.findById(req.params.id);

    if (service) {
        res.json({
            success: true,
            data: service
        });
    } else {
        res.status(404);
        throw new Error('Travel service not found');
    }
});

// @desc    Create travel service (Admin)
// @route   POST /api/travel
// @access  Private/Admin
const createTravelService = asyncHandler(async (req, res) => {
    const service = await TravelService.create(req.body);

    res.status(201).json({
        success: true,
        data: service
    });
});

// @desc    Update travel service (Admin)
// @route   PUT /api/travel/:id
// @access  Private/Admin
const updateTravelService = asyncHandler(async (req, res) => {
    let service = await TravelService.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Travel service not found');
    }

    service = await TravelService.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({
        success: true,
        data: service
    });
});

// @desc    Delete travel service (Admin)
// @route   DELETE /api/travel/:id
// @access  Private/Admin
const deleteTravelService = asyncHandler(async (req, res) => {
    const service = await TravelService.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Travel service not found');
    }

    await service.deleteOne();

    res.json({
        success: true,
        message: 'Travel service deleted'
    });
});

// @desc    Get travel services for chatbot (simplified)
// @route   GET /api/travel/chatbot/data
// @access  Public
const getTravelDataForChatbot = asyncHandler(async (req, res) => {
    const services = await TravelService.find({ isActive: true })
        .select('name type source destination price duration rating availableSeats departureDate')
        .limit(50);

    res.json({
        success: true,
        data: services
    });
});

module.exports = {
    getTravelServices,
    getTravelServiceById,
    createTravelService,
    updateTravelService,
    deleteTravelService,
    getTravelDataForChatbot
};
