import mongoose from 'mongoose';

const VerificationLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  secret: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    expires: 3600,
    default: Date.now,
  },
});

export default mongoose.model('Verification Link', VerificationLinkSchema);
