import { All, Controller, Req, Res, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';

import { auth } from './auth';

/**
 * Mounts Better Auth's request handler at `/api/auth/*`.
 *
 * Better Auth exposes every endpoint under `/api/auth/*` (sign-in, sign-up,
 * session, callback URLs for OAuth providers, etc.). We forward *every* HTTP
 * method to the framework-agnostic `auth.handler` so it can route internally.
 */
@Controller('api/auth')
export class AuthController {
  @All('*')
  async handle(@Req() req: Request, @Res() res: Response): Promise<void> {
    // Reconstruct a WHATWG Request that Express can hand off to Better Auth.
    const url = `${req.protocol}://${req.get('host') ?? 'localhost'}${req.originalUrl}`;

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, v);
      } else {
        headers.set(key, String(value));
      }
    }

    const init: RequestInit = { method: req.method, headers };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = req.body ? JSON.stringify(req.body) : undefined;
    }

    const webRequest = new Request(url, init);
    const webResponse = await auth.handler(webRequest);

    res.status(webResponse.status);
    webResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') return;
      res.setHeader(key, value);
    });

    if (typeof webResponse.headers.getSetCookie === 'function') {
      const cookies = webResponse.headers.getSetCookie();
      if (cookies.length > 0) {
        res.setHeader('set-cookie', cookies);
      }
    } else {
      const cookie = webResponse.headers.get('set-cookie');
      if (cookie) {
        res.setHeader('set-cookie', cookie);
      }
    }

    const body = await webResponse.text();
    // Forward the original body verbatim (including error details) so the
    // caller can see what actually went wrong. Nest will only log a phantom
    // "Auth handler error" if the response is *empty* and the status is 5xx.
    if (body) {
      res.send(body);
      return;
    }
    if (webResponse.status >= 500) {
      throw new HttpException('Auth handler error', webResponse.status);
    }
    res.end();
  }
}
