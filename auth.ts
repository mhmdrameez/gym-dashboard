import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Directly extract email and password from credentials
        const { email, password } = credentials;

        console.log("credentials", credentials);

        // Create a payload with only email and password
        const payload = {
          email,
          password,
        };

        console.log("payload", payload);

        // Make an API request to your custom login endpoint using axios
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log("response", response?.data);

          // Extract user data from the API response
          const { succes, data } = response.data;

          if (succes) {
            const { user, access } = data;
            if (user && user.email) {
              // Return user data if authentication is successful
              return { ...user, access }; // Include access tokens if needed
            }
          } else {
            console.log('No user data returned from API');
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
