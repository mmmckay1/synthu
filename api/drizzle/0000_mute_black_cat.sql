CREATE TABLE "attempts" (
	"attempt_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "attempts_attempt_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"lesson_id" integer NOT NULL,
	"submitted_patch" jsonb NOT NULL,
	"score" real NOT NULL,
	"passed" boolean NOT NULL,
	"gave_up" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"chapter_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chapters_chapter_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"number" integer NOT NULL,
	"intro_text" text NOT NULL,
	CONSTRAINT "chapters_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"lesson_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lessons_lesson_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"chapter_id" integer NOT NULL,
	"target_patch" jsonb NOT NULL,
	"unlocked_parameters" jsonb NOT NULL,
	"title" text NOT NULL,
	"intro_text" text NOT NULL,
	"explanation" text NOT NULL,
	"number" integer NOT NULL,
	CONSTRAINT "lessons_chapter_id_number_unique" UNIQUE("chapter_id","number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_lesson_id_lessons_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("lesson_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_chapter_id_chapters_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("chapter_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempts_user_lesson_idx" ON "attempts" USING btree ("user_id","lesson_id");