const mongoose = require("mongoose");
const tweetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true,
        },
        review: {
            type: String,
            reqired: true,
        },
        count: {
                type: String,
                
            },
    },
    { timestamps: true }
);

module.exports = mongoose.model("review", tweetSchema);
