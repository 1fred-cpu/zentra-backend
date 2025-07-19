import fastify from "./../../server";
import { checkUserExists } from "../../methods/check-user-exits";
import { createUser } from "../../methods/create-a-user";
import { generateVerificationLink } from "../../methods/generate-verification-link";
import { sendVerificationLink } from "../../methods/send-verification-link";

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
        await sendVerificationLink(email);

        return {
            message:
                "A verification link sent to your email, verify to continue with zentra"
        };
    } catch (error) {
        if (error.statusCode === 409) throw error;
        throw error;
    }
}
