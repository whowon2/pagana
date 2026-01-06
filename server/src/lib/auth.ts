import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "mysql", // or "mysql", "sqlite"
  }),
  trustedOrigins: ["http://localhost:3000", "https://pagana.vercel.app"],
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    // 2. Force these attributes to allow cross-site cookies
    defaultCookieAttributes: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    },
  },
});
