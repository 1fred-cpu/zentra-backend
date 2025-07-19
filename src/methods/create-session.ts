import { Types } from "mongoose";
import SessionModel from "../models/session-model";
import { signToken } from "../utils/jwt";
export async function createSession(
    userId: Types.ObjectId,
    email: string,
    name: string
): Promise<string> {
    const session = await SessionModel.create({
        userId,
        email,
        name
    });
    const token = await signToken({ userId, email, name });
    return token
}
