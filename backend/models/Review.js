const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    travelService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TravelService',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Prevent user from submitting more than one review per service
reviewSchema.index({ user: 1, travelService: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function (travelServiceId) {
    const stats = await this.aggregate([
        { $match: { travelService: travelServiceId } },
        {
            $group: {
                _id: '$travelService',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('TravelService').findByIdAndUpdate(travelServiceId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            reviewCount: stats[0].numReviews
        });
    } else {
        await mongoose.model('TravelService').findByIdAndUpdate(travelServiceId, {
            rating: 0,
            reviewCount: 0
        });
    }
};

// Update rating after save
reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.travelService);
});

// Update rating after remove
reviewSchema.post('remove', function () {
    this.constructor.calcAverageRating(this.travelService);
});

module.exports = mongoose.model('Review', reviewSchema);
