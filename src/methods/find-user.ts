import UserModel, { User } from '../models/userModel';
import { comparePassword } from './hash';
import fastify from 'server';
export async function getUser(
  email: string,
  password?: string,
  option: 'auth' | 'no-auth' = 'auth',
) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw fastify.httpErrors.notFound('User not found');
  }
  if (option === 'auth' && password) {
    const isPasswordValid = await comparePassword(password as string, user.password);
    if (isPasswordValid) return user;
    else {
      fastify.httpErrors.forbidden('Invalid password provided');
    }
  } else if (option === 'no-auth') {
    return user;
  }
}
