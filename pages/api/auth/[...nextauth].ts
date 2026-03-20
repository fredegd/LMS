import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const authEmail =
          process.env.LOCAL_USER_EMAIL ||
          process.env.AUTH_EMAIL;
        const authPassword =
          process.env.LOCAL_USER_PASSWORD ||
          process.env.AUTH_PASSWORD;

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (!authEmail || !authPassword) {
          console.warn(
            "Missing LOCAL_USER_EMAIL/LOCAL_USER_PASSWORD environment variables.",
          );
          return null;
        }

        if (
          credentials.email.trim().toLowerCase() ===
            authEmail.trim().toLowerCase() &&
          credentials.password === authPassword
        ) {
          return {
            id: authEmail,
            email: authEmail,
            name: "LMS User",
          };
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
