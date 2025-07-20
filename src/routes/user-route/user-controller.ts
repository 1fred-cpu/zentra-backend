import { FastifyInstance } from 'fastify';
import {
  signUpUserHandler,
  signInUserHandler,
  logoutUserHandler,
  updateUser,
} from '../user-route/user-handler';
import { signUpSchema } from './schema/sign-up-schema';
import { verifySchema } from './schema/verify-schema';
import { signInSchema } from './schema/sign-in-schema';
import { updateSchema } from './schema/update-schema';
import { authPrehandler } from 'prehandlers/auth-prehandler';
export default function userController(fastify: FastifyInstance) {
  // Method: Post
  // Privacy: Public
  // Url: api/users/create
  fastify.post('/create', { schema: signUpSchema }, signUpUserHandler);

  // Method: Post
  // Privacy: Public
  // Url: api/users/signin
  fastify.post('/signin', { schema: signInSchema }, signInUserHandler);

  // Method: Post
  // Privacy: Private
  // Url: api/users/logout
  fastify.post('/logout', logoutUserHandler);

  // Method: Patch
  // Privacy: Private
  // Url: api/users/:userId/update
  fastify.patch(
    '/:userId/update',
    { preHandler: authPrehandler, schema: updateSchema },
    updateUser,
  );
}
