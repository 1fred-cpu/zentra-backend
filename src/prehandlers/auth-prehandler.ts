import { FastifyReply } from 'fastify';
import { FastifyRequestWithUser } from 'routes/user-route/user-handler';
import { verifyToken } from 'utils/jwt';
import fastify from 'server';
import SessionModel from 'models/session-model';

export async function authPrehandler(
  request: FastifyRequestWithUser,
  reply: FastifyReply,
  done: any,
) {
  const token = request.cookies['token'];
  try {
    if (!token) {
      throw fastify.httpErrors.unauthorized('No token provided');
    }
    // Verify the token and extract user information
    const user = await verifyToken(token);
    const { userId } = user;
    if (!user) {
      throw fastify.httpErrors.unauthorized('Invalid token');
    }
    console.log('User in authMiddleware:', user);
    // Check if the session exists for the user
    const session = await SessionModel.findOne({
      userId,
    });
    if (!session) {
      throw fastify.httpErrors.unauthorized('Session not found');
    }
    request.user = user; // Attach user to request object
    done();
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw error;
    }
    // throw fastify.httpErrors.internalServerError('Token verification failed');
    throw error;
  }
}
