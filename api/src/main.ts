import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import { AppModule } from './app.module';

let cachedServer: Express;

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ];

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

// Local server execution (when not running in Vercel serverless environment)
if (!process.env.VERCEL) {
  void bootstrapServer().then((server) => {
    server.listen(process.env.PORT ?? 3000, () => {
      console.log(`Server listening on port ${process.env.PORT ?? 3000}`);
    });
  });
}

// Export default serverless handler for Vercel
export default async function handler(req: Request, res: Response) {
  const server = await bootstrapServer();
  return server(req, res);
}
