import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * NextAuth configuration.
 *  • Google OAuth (needs GOOGLE_CLIENT_ID/SECRET)
 *  • Email + password via Prisma + bcrypt
 *  • JWT sessions (no adapter needed); Google users are upserted so orders link.
 * Guest checkout works without any of this.
 */

const hasDb = () => !!process.env.DATABASE_URL;
async function getDb() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export const authOptions: NextAuthOptions = {
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
        if (!credentials?.email || !credentials?.password || !hasDb()) return null;
        try {
          const prisma = await getDb();
          const user = await prisma.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
          if (!user?.passwordHash) return null;
          const ok = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!ok) return null;
          return { id: user.id, email: user.email, name: user.name ?? undefined, image: user.image ?? undefined };
        } catch (e) {
          console.error("[auth] authorize failed:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Persist Google users so their orders can be linked to the account.
      if (account?.provider === "google" && hasDb() && user.email) {
        try {
          const prisma = await getDb();
          await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name ?? undefined, image: user.image ?? undefined },
            create: { email: user.email, name: user.name ?? undefined, image: user.image ?? undefined },
          });
        } catch (e) {
          console.error("[auth] google upsert failed:", e);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // On sign-in, attach the DB user id + role to the token.
      if (user?.email && hasDb()) {
        try {
          const prisma = await getDb();
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
          if (dbUser) {
            token.uid = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (e) {
          console.error("[auth] jwt lookup failed:", e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = (token.uid as string) ?? token.sub;
        (session.user as { role?: string }).role = (token.role as string) ?? "CUSTOMER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
