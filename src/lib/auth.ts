import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";

/**
 * NextAuth configuration.
 * - Google OAuth login
 * - Email/password (Credentials) login
 * - Guest checkout is handled separately (no session required)
 *
 * Enable the PrismaAdapter once DATABASE_URL is set.
 */
export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // if (user && (await verify(user.passwordHash, credentials.password))) return user;
        // Demo: accept any email for preview builds.
        return { id: "demo", email: credentials.email, name: credentials.email.split("@")[0] };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
