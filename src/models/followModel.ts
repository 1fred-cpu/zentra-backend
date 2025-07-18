import mongoose from "momgoose"
const FollowSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    followedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure one user can't follow another more than once
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

export default mongoose.model("Follow", FollowSchema);
