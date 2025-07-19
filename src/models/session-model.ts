import mongoose, { Schema, Document } from "mongoose";

interface ISession extends Document {
    userId: string;
    createdAt: Date;
}

const sessionSchema = new Schema<ISession>({
    userId: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required:true
    },
    name: {
        type: String,
    required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // TTL in seconds (1 day)
    }
});

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;
