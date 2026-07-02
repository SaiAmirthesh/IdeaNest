import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

import { auth } from "./auth";
import type { Session, User } from "./auth.types";

/**
 * Express request augmented with the optional session/user that
 * `AuthGuard` (or the `@CurrentUser` / `@CurrentSession` decorators) attach.
 */
export interface AuthenticatedRequest extends Request {
  session?: Session | null;
  user?: User | null;
}

/**
 * Validates the session cookie / bearer token via Better Auth.
 *
 * Usage:
 *   @UseGuards(AuthGuard)
 *   @Get('me')
 *   me(@CurrentUser() user: User) { return user; }
 *
 * Set `optional: true` in metadata to allow anonymous access (the resolved
 * session/user — possibly null — is still attached to the request).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Better Auth reads the session token from cookies / Authorization header
    // directly off the request object.
    const session = await auth.api.getSession({ headers: request.headers });
    request.session = session;
    request.user = session?.user ?? null;

    const optional = this.isOptional(context);
    if (!session && !optional) {
      throw new UnauthorizedException("No active session");
    }

    return true;
  }

  private isOptional(context: ExecutionContext): boolean {
    return Boolean(context.getHandler().name && Reflect.getMetadata("auth:optional", context.getHandler()));
  }
}
