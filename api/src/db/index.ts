import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

/**
 * Single Drizzle instance for the whole app.
 *
 * `schema` is required so the Better Auth Drizzle adapter can resolve model
 * names (`user`, `session`, `account`, `verification`) to the actual
 * `pgTable` objects re-exported from `./schema`.
 */
export const db = drizzle({ client: pool, schema });
export { schema };

