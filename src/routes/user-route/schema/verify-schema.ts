export const verifySchema = {
    body: {
        type: "object",
        properties: {
            userId: { type: "string" },
            secret: { type: "string" }
        },
        required: ["userId", "secret"]
    }
};
