import { FastifySchema } from 'fastify';

export const verifySchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      secret: { type: 'string' },
    },
    required: ['userId', 'secret'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string' },
        },
      },
      required: ['message', 'user'],
    },
  },
};
