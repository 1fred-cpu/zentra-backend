import UserModel, { User } from '../models/userModel';
import { comparePassword } from './hash';
import fastify from 'server';
export async function getUser(
  email?: string,
  userId?: string,
  password?: string,
  option: 'auth' | 'no-auth' = 'auth',
) {
  if (option === 'auth' && password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw fastify.httpErrors.notFound('User not found');
    }
    const isPasswordValid = await comparePassword(password as string, user.password);
    if (!isPasswordValid) {
      throw fastify.httpErrors.forbidden('Invalid password provided');
    }

    return user;
  } else if (option === 'no-auth' && userId) {
    const user = await UserModel.findById(userId);
    if (!user) throw fastify.httpErrors.notFound('User not found');
    return user;
  }
}
