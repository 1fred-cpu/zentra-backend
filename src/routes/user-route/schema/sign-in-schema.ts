import { FastifySchema } from 'fastify';
import { access } from 'fs';

export const signInSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['email', 'password'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
      required: ['access_token'],
    },
  },
};
