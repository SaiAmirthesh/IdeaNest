import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';
import { idea } from './idea-schema';

export const note = pgTable(
  'note',
  {
    id: text('id').primaryKey(),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),

    ideaId: text('idea_id').references(() => idea.id, {
      onDelete: 'cascade',
    }),

    title: text('title').notNull(),

    content: text('content').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('note_user_idx').on(table.userId),
    index('note_idea_idx').on(table.ideaId),
  ],
);

export const noteRelations = relations(note, ({ one }) => ({
  user: one(user, {
    fields: [note.userId],
    references: [user.id],
  }),
  idea: one(idea, {
    fields: [note.ideaId],
    references: [idea.id],
  }),
}));

export const ideaRelations = relations(idea, ({ many, one }) => ({
  user: one(user, {
    fields: [idea.userId],
    references: [user.id],
  }),
  notes: many(note),
}));
