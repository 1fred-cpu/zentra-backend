import fastify from "./../../server";
import { checkUserExists } from "../../methods/check-user-exits";
import { createUser } from "../../methods/create-a-user";
import { generateVerificationLink } from "../../methods/generate-verification-link";
import { sendVerificationLink } from "../../methods/send-verification-link";
import VerificationLinkModel from "../../models/verification-link-model";
import UserModel from "../../models/userModel";
import { Types } from "mongoose";
import { createSession } from "../../methods/create-session";
export async function signUpUser(request, reply) {
    try {
        const { email, name, password } = request.body;
        const userExists = await checkUserExists(email);
        if (userExists) {
            throw fastify.httpErrors.conflict(
                "An account with this email already exists."
            );
        }
        const newUser = await createUser(email, password, name);
        const link = await generateVerificationLink(newUser._id);
        await sendVerificationLink(link, email);

        return {
            message:
                "A verification link sent to your email, verify to continue with zentra"
        };
    } catch (error) {
        if (error.statusCode === 409) throw error;
        throw error;
    }
}

export async function verifyUser(request, reply) {
    try {
        const { userId, secret } = request.body;
        const objectUserId = Types.ObjectId(userId);
        const isLinkActive = await VerificationLinkModel.findOne({
            userId: objectUserId,
            secret
        });
        if (!isLinkActive) {
            throw fastify.httpErrors.forbidden(
                "Sorry verification link has expired"
            );
        }
        const updatedUser = await UserModel.findOneAndUpdate(
            {
                userId: objectUserId
            },
            { emailVerified: true },
            { new: true }
        );

        await VerificationLinkModel.findOneAndDelete({
            userId: objectUserId,
            secret
        });
        const token = await createSession(
            objectUserId,
            updatedUser.email,
            updatedUser.name
        );
        re
    } catch (error) {
        if (error.statusCode === 403) throw error;
        throw error;
    }
}
