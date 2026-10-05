import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// Questions the assistant could not answer from verified sources; triaged by admins.
export const questions = pgTable('questions', {
  id: serial().primaryKey(),
  question: text().notNull(),
  lang: text().notNull().default('ar'),
  contactEmail: text('contact_email'),
  userId: text('user_id'),
  userEmail: text('user_email'),
  status: text().notNull().default('open'), // open | answered | closed
  answer: text(),
  answeredBy: text('answered_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  answeredAt: timestamp('answered_at'),
})

// Admin decisions on AI-extracted proposals in the review queue.
export const reviewDecisions = pgTable('review_decisions', {
  id: serial().primaryKey(),
  taskId: text('task_id').notNull(),
  decision: text().notNull(), // approved | rejected
  reviewerEmail: text('reviewer_email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Qur'an reading streak per signed-in user.
export const readingProgress = pgTable('reading_progress', {
  userId: text('user_id').primaryKey(),
  streak: integer().notNull().default(0),
  best: integer().notNull().default(0),
  totalDays: integer('total_days').notNull().default(0),
  lastDate: text('last_date'),
  lastSurah: integer('last_surah'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
