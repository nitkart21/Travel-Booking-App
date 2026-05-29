const mongoose = require('mongoose');

const travelServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide service name'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    type: {
        type: String,
        required: [true, 'Please specify service type'],
        enum: ['bus', 'hotel', 'trip']
    },
    source: {
        type: String,
        required: [true, 'Please provide source location'],
        trim: true
    },
    destination: {
        type: String,
        required: [true, 'Please provide destination'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: [0, 'Price cannot be negative']
    },
    duration: {
        type: String,
        required: [true, 'Please provide duration']
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    images: [{
        type: String
    }],
    amenities: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    availableSeats: {
        type: Number,
        required: [true, 'Please provide available seats/rooms'],
        min: [0, 'Available seats cannot be negative']
    },
    departureDate: {
        type: Date
    },
    departureTime: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for search functionality
travelServiceSchema.index({ source: 'text', destination: 'text', name: 'text' });

module.exports = mongoose.model('TravelService', travelServiceSchema);
