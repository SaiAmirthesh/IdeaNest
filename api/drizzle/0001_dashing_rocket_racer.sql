CREATE TYPE "public"."idea_status" AS ENUM('SEED', 'THINKING', 'BUILDING', 'DORMANT', 'COMPLETED', 'ARCHEIVED');--> statement-breakpoint
CREATE TABLE "idea" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "idea_status" DEFAULT 'SEED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idea" ADD CONSTRAINT "idea_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idea_user_idx" ON "idea" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idea_status_idx" ON "idea" USING btree ("status");