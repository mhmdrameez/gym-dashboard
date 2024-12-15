import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { cookies } from 'next/headers'


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        console.log("credentials", credentials);

        const cookieStore = await cookies()


        // Create a payload with only email and password
        const payload = {
          email,
          password,
        };

        console.log("payload", payload);

        try {
          // Make an API request to your custom login endpoint using fetch
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/login`, // Constructing the full URL
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            }
          );

          console.log("response", response);

          // Check if the response is successful
          if (!response.ok) {
            console.error('Failed to authenticate');
            return null;
          }

          // Parse the JSON response
          const result = await response.json();
          const tokenToStore = typeof result === 'object' ? JSON.stringify(result) : String(result);
          cookieStore.set('token', tokenToStore);

          // Extract user data from the API response
          const { succes, data } = result;

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
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
});
