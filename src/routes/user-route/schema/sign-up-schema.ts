export const signUpSchema = {
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
                message: "string"
            },
            required: ["message"]
        }
    }
};
