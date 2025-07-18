import fastifyPlugin from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";

async function mongoosePlugin(fastify): FastifyPluginAsync {
    try {
        await mongoose.connect(fastify.config.MONGO_URI);
        fastify.decorate("mongoose", mongoose);
        fastify.log.info("Mongoose connected");
    } catch (error) {
        fastify.log.error(error, "Faild to connect to mongoose db");
        process.exit(1);
    }
}

export default fastifyPlugin(mongoosePlugin)