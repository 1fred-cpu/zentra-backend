import mongoose from "mongoose"
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    tags: [String],
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    files: [
        {
            type: String // URLs or paths to downloadable files
        }
    ],
    description: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    purchases: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Product", ProductSchema);
