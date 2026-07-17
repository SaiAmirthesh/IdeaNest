import { createAuthClient } from "better-auth/react";

// TODO: Update the baseURL to point to your NestJS server address in production.
// Better Auth will read session cookies from the shared domain.
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export const { signIn, signOut, useSession } = authClient;
