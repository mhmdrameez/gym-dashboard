import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { raw } from "./app/lib/db"; // Ensure this path is correct

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  address: string | null;
  gym_name: string | null;
  phone: string;
  otp: string;
  device_token: string;
  password_reset_token: string | null;
  account_verified: string;
  is_blocked: string;
  is_deleted: string;
  created_at: Date;
  updated_at: Date;
};



async function getUser(email: string): Promise<User | null> {
  try {
    const userQuery = await raw<User>("SELECT * FROM users WHERE email = ?", [email]);

    // Check if userQuery is an object and cast it as User
    if (userQuery && !Array.isArray(userQuery)) {
      return userQuery as User;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email() }) // Check only for email
          .safeParse(credentials);
    
        if (parsedCredentials.success) {
          const { email } = parsedCredentials.data;
    
          const user = await getUser(email);
    
          // Log user details if found
          if (user) {
            console.log("Signed in user:", {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              phone: user.phone,
              created_at: user.created_at,
              updated_at: user.updated_at,
            });
            return user; // Return the user if found
          }
        }
    
        console.log('Invalid credentials or user not found');
        return null;
      },
    }),
    
    
  ],
})