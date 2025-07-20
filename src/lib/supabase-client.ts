import { createClient } from '@supabase/supabase-js';
import fastify from 'server';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_ROLE_KEY as string,
);

// A method to sign up a user
export const signUpUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  } catch (error: any) {
    throw error;
  }
};

// A method to sign in a user
export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// A method to get current user
export const getCurrentUser = async (jwt?: string) => {
  try {
    const { data, error } = await supabase.auth.getUser(jwt);
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

// A method to sign out a user
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
};

// A method to create a user in the database
export const createUser = async (user: any) => {
  try {
    const { data, error } = await supabase.from('users').insert(user).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
export default supabase;
