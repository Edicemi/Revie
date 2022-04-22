const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        review: {
            type: String,
            reqired: true,
        },
        count: {
            type: Number,
            default: 0
        },
        media: [{
            type: String,
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('review', reviewSchema);