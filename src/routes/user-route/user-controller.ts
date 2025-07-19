import { signUpUser } from "../user-route/user-handler";
import { signUpSchema } from "./schema/sign-up-schema";
export default function userController(fastify, options) {
    // Method: Post
    // Privacy: Public
    // Url: api/users/create
    fastify.post("/create", { schema: signUpSchema }, signUpUser);
}
