import type { BetterAuthOptions } from 'better-auth';

/**
 * Framework-agnostic Better Auth configuration.
 *
 * This file holds the option object only — no adapter / db binding — so it
 * can be safely imported by:
 *   - the server-side `auth.ts` (which wires in the Drizzle adapter)
 *   - the client (if a frontend is added later) without pulling in the db
 *
 * Anything that depends on the database / server runtime belongs in
 * `auth.ts`, not here.
 */
export const authConfig: BetterAuthOptions = {
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // CSRF / origin whitelist for the dev server and any deployed frontend.
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    'http://localhost:5173', // typical Vite dev server
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
  },

  rateLimit: {
    enabled: true,
    window: 60, // seconds
    max: 100, // requests per window per IP
  },
};
