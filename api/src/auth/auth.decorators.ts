import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthenticatedRequest } from './auth.guard';
import type { Session, User } from './auth.types';

/**
 * Resolves to the currently authenticated user (or `null` when used with
 * `AuthGuard` configured as optional). Apply the `AuthGuard` first:
 *
 *   @UseGuards(AuthGuard)
 *   @Get('me')
 *   me(@CurrentUser() user: User) { return user; }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User | null => {
    return ctx.switchToHttp().getRequest<AuthenticatedRequest>().user ?? null;
  },
);

/** Resolves to the full session (user + session metadata) or `null`. */
export const CurrentSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Session | null => {
    return (
      ctx.switchToHttp().getRequest<AuthenticatedRequest>().session ?? null
    );
  },
);
