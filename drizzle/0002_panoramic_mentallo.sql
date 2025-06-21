CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"preferred_posting_time" text DEFAULT '9am',
	"content_tone" text DEFAULT 'professional',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;