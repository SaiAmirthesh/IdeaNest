import type { auth } from './auth';

/**
 * Inferred Better Auth types.
 *
 * Re-exported from a single module so controllers, guards, and DTOs can
 * import them without re-inferring from `auth` directly (which would pull
 * the runtime instance into otherwise type-only code paths).
 */
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
