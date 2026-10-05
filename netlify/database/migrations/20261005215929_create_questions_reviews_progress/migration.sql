CREATE TABLE "questions" (
	"id" serial PRIMARY KEY,
	"question" text NOT NULL,
	"lang" text DEFAULT 'ar' NOT NULL,
	"contact_email" text,
	"user_id" text,
	"user_email" text,
	"status" text DEFAULT 'open' NOT NULL,
	"answer" text,
	"answered_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"answered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reading_progress" (
	"user_id" text PRIMARY KEY,
	"streak" integer DEFAULT 0 NOT NULL,
	"best" integer DEFAULT 0 NOT NULL,
	"total_days" integer DEFAULT 0 NOT NULL,
	"last_date" text,
	"last_surah" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_decisions" (
	"id" serial PRIMARY KEY,
	"task_id" text NOT NULL,
	"decision" text NOT NULL,
	"reviewer_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
