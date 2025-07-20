import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from '@supabase/supabase-js';
import fastify from 'server';
import supabase from 'lib/supabase-client';

export interface FastifyRequestWithUser extends FastifyRequest {
  user?: User;
}
export async function authPrehandler(
  request: FastifyRequestWithUser,
  reply: FastifyReply,
  done: any,
) {
  const token = request.headers['authorization']?.split(' ')[1];

  try {
    if (!token) {
      throw fastify.httpErrors.unauthorized('Authorization token is missing');
    }
    // Verify the token using Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    request.user = data.user;

    done();
  } catch (error: any) {
    // throw fastify.httpErrors.internalServerError('Token verification failed');
    throw error;
  }
}
