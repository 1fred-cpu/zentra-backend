import mongoose from "mongoose";

const VerificationLinkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 3600
    }
});

export default mongoose.model("Verification Link", VerificationLinkSchema);
