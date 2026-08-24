import { pgTable, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const ideaStatusEnum = pgEnum('idea_status', [
  'SEED',
  'THINKING',
  'BUILDING',
  'DORMANT',
  'COMPLETED',
  'ARCHEIVED',
]);

export const idea = pgTable(
  'idea',
  {
    id: text('id').primaryKey(),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),

    title: text('title').notNull(),

    description: text('description').notNull(),

    status: ideaStatusEnum('status').default('SEED').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idea_user_idx').on(table.userId),
    index('idea_status_idx').on(table.status),
  ],
);
