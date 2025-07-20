import mongoose, { Schema, Document } from "mongoose";

interface ISession extends Document {
    userId: string;
    role:'user'| 'creator'
    createdAt: Date;
}

const sessionSchema = new Schema<ISession>({
    userId: { type: String, required: true },
    role: { type: String, enum: ['user', 'creator'], default: 'user' },
    // TTL for session expiration
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // TTL in seconds (1 day)
    }
});

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;
