import SessionModel from "../models/session-model";
import { signToken } from "../utils/jwt";
export async function createSession(
    userId: string,
    role: 'user' | 'creator' = 'user',
): Promise<string> {
    const session = await SessionModel.create({
    userId,
    role
    });
    const token = await signToken({ userId, role , sessionId: session._id }, "1d");
    return token
}
