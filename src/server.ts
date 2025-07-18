import Fastify from "fastify";
import config from "./plugins/config.js";
import routes from "./routes/index.js";
import dbConnector from "./plugins/db-connector";
import mongoosePlugin from "./plugins/mongoose";
import userRoutes from "./routes/user-route/user-controller";
const fastify = Fastify({
    ajv: {
        customOptions: {
            removeAdditional: "all",
            coerceTypes: true,
            useDefaults: true
        }
    },
    logger: {
        level: process.env.LOG_LEVEL
    }
});

await fastify.register(config);
//Mongodb connection
await fastify.register(mongoosePlugin);
// await fastify.register(dbConnector);
// user routes endpoints
await fastify.register(userRoutes, { prefix: "/api/users" });
await fastify.register(routes);
await fastify.ready();

export default fastify;
