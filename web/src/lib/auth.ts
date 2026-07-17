import { createAuthClient } from "better-auth/react";

// TODO: Update the baseURL to point to your NestJS server address in production.
// Better Auth will read session cookies from the shared domain.
export const authClient = createAuthClient({
  baseURL: window.location.origin,
});

export const { signIn, signOut, useSession } = authClient;
