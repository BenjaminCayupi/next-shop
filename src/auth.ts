import NextAuth, { CredentialsSignin, NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';

const protectedRoutes = ['/profile', '/admin', '/checkout', '/orders'];

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isRouteProtected = protectedRoutes.find((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isRouteProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },
    session({ session, token, user }) {
      session.user = token.data as any;

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // Buscar usuario
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) return null;

        // Comparar las contraseñas
        if (!bcryptjs.compareSync(password, user.password)) return null;

        // Retornar usuario sin password
        const { password: _, ...rest } = user;

        return rest;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
