import mongoose from "mongoose";
const FavoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    favoritedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate favorites
FavoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Favorite", FavoriteSchema);
