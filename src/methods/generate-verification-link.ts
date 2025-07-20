import VerficationLinkModel from '../models/verification-link-model';
import { Types } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { getExpireTime } from './get-expired-time';
export async function generateVerificationLink(userId: Types.ObjectId): Promise<string> {
  const secret = uuid();
  const expiresAt = getExpireTime(undefined, 3600);
  const linkModel = await new VerficationLinkModel({
    userId,
    secret,
  });
  await linkModel.save();
  return `${process.env.VERIFICATION_LINK}?userId=${userId.toString()}&&secret=${secret}`;
}
