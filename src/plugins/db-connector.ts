import fastifyMongo from "@fastify/mongodb";
import fastifyPlugin from "fastify-plugin";

function dbConnector(server, options) {
    server.register(fastifyMongo, { url: server.config.MONGO_URI });
}

export default fastifyPlugin(dbConnector);
