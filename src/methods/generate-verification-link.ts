import VerficationLinkModel from "../models/verification-link-model";
import { Types } from "mongoose";
import { v4 as uuid } from "uuid";
import { getExpiredTime } from "./get-expired-time";
export async function generateVerificationLink(
    userId: Types.ObjectId
): Prmose<string> {
    const secret = uuid();
    const expiresAt = getExpiredTime(3600);
    const linkModel = await new VerficationLinkModel({
        userId,
        secret,
        expiresAt
    });
    await linkModel.save();
    return `${process.env.VERIFICATION_LINK}?userId=${userId.toString()}&&secret=${secret}`;
    
}
