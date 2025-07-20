import Fastify from 'fastify';
import config from './plugins/config.js';
import routes from './routes/index.js';
import dbConnector from './plugins/db-connector';
import mongoosePlugin from './plugins/mongoose';
import sensible from '@fastify/sensible';
import userRoutes from './routes/user-route/user-controller';
import dotenv from 'dotenv';
import fastifyCookie from '@fastify/cookie';
dotenv.config();

const fastify = Fastify({
  ajv: {
    customOptions: {
      removeAdditional: 'all',
      coerceTypes: true,
      useDefaults: true,
    },
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
});

await fastify.register(config);
// for signed cookies
await fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});
// Http errors methods
await fastify.register(sensible);
// user routes endpoints
await fastify.register(userRoutes, { prefix: '/api/users' });
await fastify.register(routes);
await fastify.ready();

export default fastify;
