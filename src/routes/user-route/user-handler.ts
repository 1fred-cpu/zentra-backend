import fastify from './../../server';
import { checkUserExists } from '../../methods/check-user-exits';
import { createUser } from '../../methods/create-a-user';
import { generateVerificationLink } from '../../methods/generate-verification-link';
import { sendVerificationLink } from '../../methods/send-verification-link';
import VerificationLinkModel from '../../models/verification-link-model';
import UserModel, { User } from '../../models/userModel';
import { Types } from 'mongoose';
import { createSession } from '../../methods/create-session';
import { FastifyRequest, FastifyReply } from 'fastify';
import { getUser } from 'methods/find-user';
import SessionModel from '../../models/session-model';
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

export async function signUpUser(
  request: FastifyRequest<{ Body: SignUpUserBody }>,
  reply: FastifyReply,
) {
  try {
    const { email, name, password } = request.body;
    const userExists = await checkUserExists(email);
    if (userExists) {
      throw fastify.httpErrors.conflict('An account with this email already exists.');
    }
    const newUser = await createUser(email, password, name);
    const link = await generateVerificationLink(newUser._id as Types.ObjectId);
    await sendVerificationLink(link, email);

    return {
      message: 'A verification link sent to your email, verify to continue with zentra',
    };
  } catch (error: any) {
    if (error.statusCode === 409) throw error;
    throw fastify.httpErrors.internalServerError('An unexpected error occurred');
  }
}

export async function verifyUser(
  request: FastifyRequest<{ Body: VerifyUserBody }>,
  reply: FastifyReply,
) {
  try {
    // Extract userId and secret from the request body
    const { userId, secret } = request.body;
    // Checks if userId or secret was not provided
    if (!userId || !secret) {
      throw fastify.httpErrors.badRequest(
        `${userId ? 'Secret key was not provided' : 'userId was not provided'}`,
      );
    }
    // Check if link is valid
    const isLinkActive = await VerificationLinkModel.findOne({
      userId: new Types.ObjectId(userId),
      secret,
    });
    if (!isLinkActive) {
      throw fastify.httpErrors.forbidden('Sorry verification link is invalid or has expired');
    }
    // Update user emailVerified status
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { emailVerified: true },
      { new: true },
    );
    // Delete the verification link after successful verification
    await VerificationLinkModel.findByIdAndDelete(isLinkActive._id);

    // If user not found, throw an error
    if (!updatedUser) {
      throw fastify.httpErrors.notFound('User not found.');
    }
    // Create a session for the user
    const jwt = await createSession(userId, updatedUser.role);
    // Set the JWT token in a cookie
    reply.setCookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 86400 * 1000), // 1 day
    });
    // Return a success message
    return {
      message: 'User verified successfully.',
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    };
  } catch (error: any) {
    if (error.statusCode === 400) throw error;
    else if (error.statusCode === 403) throw error;
    else if (error.statusCode === 404) throw error;
    throw fastify.httpErrors.internalServerError('An unexpected error occurred');
  }
}

export async function signInUser(
  request: FastifyRequest<{ Body: SignInUserBody }>,
  reply: FastifyReply,
) {
  try {
    // Extracts email, and password from body
    const { email, password } = request.body;
    // Gets a user with email and password
    const user = await getUser(email, password, 'auth');
    // Checks if user email is verified
    if (!user?.emailVerified) {
      const link = await generateVerificationLink(user?._id as Types.ObjectId);
      await sendVerificationLink(link, user?.email as string);
      throw fastify.httpErrors.unauthorized('Please verify your email to continue.');
    }
    // Checks if user already has a session
    const existingSession = await SessionModel.findOne({ userId: user?._id });
    if (existingSession) {
      throw fastify.httpErrors.unauthorized('You already have an active session.');
    }
    // Create a session for the user
    const jwt = await createSession(user?._id.toString() as string, user?.role);
    // Set the JWT token in a cookie
    reply.setCookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 86400 * 1000), // 1 day
    });
    // Return a success message
    return {
      message: 'User verified successfully.',
      user: {
        id: user?._id.toString(),
        email: user?.email,
        name: user?.name,
        role: user?.role,
      },
    };
  } catch (error: any) {
    if (error.statusCode === 401) throw error;
    else if (error.statusCode === 403) throw error;
    else if (error.statusCode === 404) throw error;
    throw fastify.httpErrors.internalServerError('An unexpected error occurred');
  }
}

export interface FastifyRequestWithUser extends FastifyRequest {
  user?: User;
}

export async function logoutUser(request: FastifyRequestWithUser, reply: FastifyReply) {
  try {
    // Get the user from the request
    const user = request.user as User;
    // Delete the session for the user
    await SessionModel.findOneAndDelete({ userId: user._id });
    // Clear the JWT token cookie
    reply.setCookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    // Return a success message
    return { message: 'User logged out successfully.' };
  } catch (error) {
    throw fastify.httpErrors.internalServerError('An error occurred while logging out.');
  }
}
