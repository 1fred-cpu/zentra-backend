import fastify from './../../server';
import { generateVerificationLink } from '../../methods/generate-verification-link';
import { sendVerificationLink } from '../../methods/send-verification-link';
import VerificationLinkModel from '../../models/verification-link-model';
import UserModel, { User } from '../../models/userModel';
import { Types } from 'mongoose';
import { createSession } from '../../methods/create-session';
import { FastifyRequest, FastifyReply } from 'fastify';
import { getUser } from 'methods/find-user';
import SessionModel from '../../models/session-model';
import { hashPassword } from 'methods/hash';
import supabase, { signUpUser, createUser, signInUser, signOutUser } from 'lib/supabase-client';

interface SignUpUserBody {
  email: string;
  name: string;
  password: string;
}
interface VerifyUserBody {
  userId: string;
  secret: string;
}
interface SignInUserBody {
  email: string;
  password: string;
}

export async function signUpUserHandler(
  request: FastifyRequest<{ Body: SignUpUserBody }>,
  reply: FastifyReply,
) {
  try {
    // Extracts email, name, and password from body
    const { email, name, password } = request.body;
    //Create a new user in auth system
    const user = await signUpUser(email, password);
    // Creates a new user in the database
    await createUser({ name, email: user?.email, id: user?.id });
    // Sends a message to the user
    return {
      message: 'A user was created successfully. Please check your email to verify your account.',
    };
  } catch (error: any) {
    if (error.status === 429) {
      throw fastify.httpErrors.tooManyRequests('Too many requests. Please try again later.');
    }
    if (error.details.includes('already exists'))
      throw fastify.httpErrors.conflict('User with this email already exists');
  }
}

export async function signInUserHandler(
  request: FastifyRequest<{ Body: SignInUserBody }>,
  reply: FastifyReply,
) {
  // Extracts email, and password from body
  const { email, password } = request.body;
  try {
    // Signs in a user and create a session
    const data = await signInUser(email, password);
    // Gets the access_token
    const access_token = data.session.access_token;
    // Returns access token to user
    return { access_token };
  } catch (error: any) {
    // Sends a message when rate limit of request reach
    if (error.status === 429) {
      throw fastify.httpErrors.tooManyRequests('Too many requests. Please try again later.');
    }
    // Sends a message  when email is not verified or confirmed and sends a confirm link to confirm
    else if (error.status === 400 && error.message.includes('Email not confirmed')) {
      const { data, error } = await supabase.auth.admin.generateLink({
        email,
        password,
        type: 'signup',
      });
      if (error) console.log(error);
      else {
        console.log(data);
      }

      throw fastify.httpErrors.badRequest('Please your email is not confirmed.');
    }
    throw error;
  }
}

export interface FastifyRequestWithUser extends FastifyRequest {
  user?: User;
}

export async function logoutUserHandler(request: FastifyRequestWithUser, reply: FastifyReply) {
  try {
    await signOutUser();
    return { message: 'Logged out successfully' };
  } catch (error) {
    // throw fastify.httpErrors.internalServerError('An error occurred while logging out.');
    throw error;
  }
}

export async function updateUser(request: any, reply: FastifyReply) {
  try {
    let hashedPassword;
    // Gets user payload from body
    const payload = request.body;
    // Gets userId from params
    const userId = request.params.userId;
    // Gets user with userId
    const user = await getUser(userId, 'no-auth');
    // Checks if user want to update password
    if (payload.password) {
      hashedPassword = await hashPassword(payload.password);
    }
    // Use userId to update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { ...payload, password: hashedPassword || user?.password },
      { new: true },
    );

    if (!updatedUser) {
      throw fastify.httpErrors.notFound('User not found');
    }
    return {
      message: 'User updated successfully.',
      user: {
        id: updatedUser?._id.toString(),
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role,
      },
    };
  } catch (error: any) {
    if (error.statusCode === 404) throw error;
    throw error;
  }
}
