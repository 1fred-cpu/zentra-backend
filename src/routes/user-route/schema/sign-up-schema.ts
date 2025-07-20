import { FastifySchema } from "fastify";

export const signUpSchema: FastifySchema = {
    body: {
        type: "object",
        properties: {
            name: { type: "string" },
            password: { type: "string" },
            email: { type: "string" }
        },
        required: ["name", "password", "email"]
    },
    response: {
        200: {
            type: "object",
            properties: {
                message: {type: "string"}
            },
            required: ["message"]
        }
    }
};
