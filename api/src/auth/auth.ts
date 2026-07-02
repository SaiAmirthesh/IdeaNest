import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db, schema } from "../db";
import { authConfig } from "./auth.config";

/**
 * Better Auth server instance.
 *
 * Uses the Drizzle adapter against the Neon Postgres database defined in
 * `src/db/index.ts`. All request handling goes through `auth.handler` (see
 * `auth.controller.ts`) which is mounted at `/api/auth/*` on the Nest app.
 */
export const auth = betterAuth({
  ...authConfig,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});
