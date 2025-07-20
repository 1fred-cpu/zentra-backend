import { FastifyInstance } from 'fastify';
import { signUpUser, verifyUser, signInUser } from '../user-route/user-handler';
import { signUpSchema } from './schema/sign-up-schema';
import { verifySchema } from './schema/verify-schema';
import { signInSchema } from './schema/sign-in-schema';
export default function userController(fastify: FastifyInstance) {
  // Method: Post
  // Privacy: Public
  // Url: api/users/create
  fastify.post('/create', { schema: signUpSchema }, signUpUser);

  // Method: Post
  // Privacy: Public
  // Url: api/users/verify
  fastify.post('/verify', { schema: verifySchema }, verifyUser);

  // Method: Post
  // Privacy: Public
  // Url: api/users/signin
  fastify.post('/signin', { schema: signInSchema }, signInUser);
}
