import { signUpUser } from "../user-route/user-handler";
import { signUpSchema } from "./schema/sign-up-schema";
import { verifySchema } from "./schema/verify-schema";
export default function userController(fastify, options) {
    // Method: Post
    // Privacy: Public
    // Url: api/users/create
    fastify.post("/create", { schema: signUpSchema }, signUpUser);

    // Method: Post
    // Privacy: Public
    // Url: api/users/verify
    fastify.post("/verify", { schema: verifySchema }, signUpUser);
}
