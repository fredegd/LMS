import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import fs from "node:fs";
import path from "node:path";

let cachedLocalEnv: Record<string, string> | null = null;

const parseEnvFile = (filePath: string): Record<string, string> => {
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, "utf8");
  const entries: Record<string, string> = {};

  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;

    const equalIndex = line.indexOf("=");
    if (equalIndex < 0) return;

    const key = line.slice(0, equalIndex).trim();
    let value = line.slice(equalIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // preserve literal $ signs (Next.js dotenv-expand would otherwise interpolate them)
    entries[key] = value.replace(/\\\$/g, "$");
  });

  return entries;
};

const getRawLocalEnv = (key: string): string | undefined => {
  if (!cachedLocalEnv) {
    const cwd = process.cwd();
    cachedLocalEnv = {
      ...parseEnvFile(path.join(cwd, ".env")),
      ...parseEnvFile(path.join(cwd, ".env.local")),
    };
  }

  return cachedLocalEnv[key];
};

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
          getRawLocalEnv("LOCAL_USER_EMAIL") ||
          process.env.LOCAL_USER_EMAIL ||
          process.env.AUTH_EMAIL;
        const authPassword =
          getRawLocalEnv("LOCAL_USER_PASSWORD") ||
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
