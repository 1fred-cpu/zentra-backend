import "dotenv/config";
import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import Ajv from "ajv";
import mongoose from "mongoose";
export enum NodeEnv {
    development = "development",
    test = "test",
    production = "production"
}

const ConfigSchema = Type.Object({
    NODE_ENV: Type.Enum(NodeEnv),
    LOG_LEVEL: Type.String(),
    API_HOST: Type.String(),
    API_PORT: Type.String(),
    MONGO_URI: Type.String()
});

const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allowUnionTypes: true
});

export type Config = Static<typeof ConfigSchema>;

const configPlugin: FastifyPluginAsync = async fastify => {
    const validate = ajv.compile(ConfigSchema);
    const valid = validate(process.env);
    if (!valid) {
        throw new Error(
            ".env file validation failed - " +
                JSON.stringify(validate.errors, null, 2)
        );
    }
    fastify.decorate("config", process.env as Config);
};

declare module "fastify" {
    interface FastifyInstance {
        config: Config;
        mongoose: typeof mongoose
    }
}

export default fp(configPlugin);
