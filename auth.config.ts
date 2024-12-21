import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  providers: [],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
      const isLoggedIn = !!token;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnMembers = nextUrl.pathname.startsWith('/members');
      const isProtectedRoute = isOnDashboard || isOnMembers;
      const isLoginPage = nextUrl.pathname === '/login';

      // Redirect to dashboard if logged in and on login page
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Handle protected routes
      if (isProtectedRoute) {
        if (!isLoggedIn) {
          return false;
        }

        try {
          const parsedToken = JSON.parse(token);
          const tokenExpiry = new Date(parsedToken.data.access.token_expiry);
          
          if (tokenExpiry.getTime() <= Date.now()) {
            (await cookieStore).delete('token');
            return false;
          }
          
          return true;
        } catch {
          (await cookieStore).delete('token');
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    }
  },
} satisfies NextAuthConfig;