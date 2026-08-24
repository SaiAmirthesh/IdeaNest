import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    import.meta.env.VITE_AUTH_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
});

export const { signIn, signOut, useSession } = authClient;
