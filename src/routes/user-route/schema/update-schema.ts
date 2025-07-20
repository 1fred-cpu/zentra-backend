import { FastifySchema } from 'fastify';

export const updateSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
    },
    required: ['userId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
      required: ['message', 'user'],
    },
  },
};
