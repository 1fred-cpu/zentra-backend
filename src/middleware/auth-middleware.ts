import { FastifyReply } from 'fastify';
import { FastifyRequestWithUser } from 'routes/user-route/user-handler';
import { verifyToken } from 'utils/jwt';
import fastify from 'server';
export async function authMiddleware(
  request: FastifyRequestWithUser,
  reply: FastifyReply,
  done: any,
) {
  const token = request.cookies['token'];
  console.log('Auth Middleware Token:', token);
  try {
    if (!token) {
      throw fastify.httpErrors.unauthorized('No token provided');
    }
    // Verify the token and extract user information
    const user = await verifyToken(token);
    if (!user) {
      throw fastify.httpErrors.unauthorized('Invalid token');
    }
    request.user = user; // Attach user to request object
    done();
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw error;
    }
    throw fastify.httpErrors.internalServerError('Token verification failed');
  }
}
