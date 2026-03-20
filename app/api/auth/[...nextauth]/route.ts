import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const dynamic = "force-dynamic";

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
          process.env.CORE_USER_EMAIL ||
          process.env.AUTH_EMAIL;
        const authPassword =
          process.env.LOCAL_USER_PASSWORD ||
          process.env.CORE_USER_PASSWORD ||
          process.env.AUTH_PASSWORD;

        console.log("Authorize attempt email:", credentials?.email);
        console.log("Expected email from env:", authEmail);
        console.log("Is password present in env?:", !!authPassword);
        console.log("Password length (received):", credentials?.password?.length);
        console.log("Password length (expected):", authPassword?.length);

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials in request.");
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
          console.log("Authorization successful.");
          return {
            id: authEmail,
            email: authEmail,
            name: "LMS User",
          };
        }

        console.log("Authorization failed (credentials mismatch).");
        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
