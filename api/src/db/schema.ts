import { pgTable, uuid, text, integer, jsonb, unique, timestamp, real, boolean, index } from "drizzle-orm/pg-core"
import { authUsers } from "drizzle-orm/supabase"
import { type Patch } from "@synthu/shared"

export const users = pgTable("users", {
    userId: uuid("user_id").primaryKey().references(() => authUsers.id, { onDelete: "cascade"}),
    username: text("username").notNull().unique()
})

export const chapters = pgTable("chapters", {
    chapterId: integer("chapter_id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    number: integer("number").notNull().unique(),
    introText: text("intro_text").notNull()
})

export const lessons = pgTable("lessons", {
    lessonId: integer("lesson_id").primaryKey().generatedAlwaysAsIdentity(),
    chapterId: integer("chapter_id").notNull().references(() => chapters.chapterId),
    targetPatch: jsonb("target_patch").$type<Patch>().notNull(),
    unlockedParameters: jsonb("unlocked_parameters").$type<(keyof Patch)[]>().notNull(),
    title: text("title").notNull(),
    introText: text("intro_text").notNull(),
    explanation: text("explanation").notNull(),
    number: integer("number").notNull(),
    startPatch: jsonb("start_patch").$type<Partial<Patch>>()
}, (t) => [unique().on(t.chapterId, t.number)])

export const attempts = pgTable("attempts", {
    attemptId: integer("attempt_id").primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull().references(() => users.userId, { onDelete: "cascade"}),
    lessonId: integer("lesson_id").notNull().references(() => lessons.lessonId),
    submittedPatch: jsonb("submitted_patch").$type<Patch>().notNull(),
    score: real("score").notNull(),
    passed: boolean("passed").notNull(),
    gaveUp: boolean("gave_up").notNull().default(false),
    submittedAt: timestamp("submitted_at", { withTimezone: true}).notNull().defaultNow(),
}, (t) => [index("attempts_user_lesson_idx").on(t.userId, t.lessonId)])