import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "creator"],
        default: "user"
    },
    slug: { type: String, required: true, lowercase: true },
    avatar: {
        type: String, // URL to profile image
        default: ""
    },
    bio: {
        type: String,
        maxlength: 300
    },

    // Fields for "Creators"
    socials: {
        website: String,
        twitter: String,
        dribbble: String,
        github: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", UserSchema);
