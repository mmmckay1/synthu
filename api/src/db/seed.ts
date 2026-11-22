import { db, client } from "./index.js"
import { chapters, lessons } from "./schema.js"
import { CHAPTER_1, CHAPTER_1_LESSONS } from "@synthu/shared"

const [ chapter ] = await db.insert(chapters).values(CHAPTER_1).onConflictDoUpdate({ target: chapters.number, set: { ...CHAPTER_1}}).returning()
for (const lesson of CHAPTER_1_LESSONS){
await db.insert(lessons).values({ ...lesson, chapterId: chapter.chapterId}).onConflictDoUpdate({ target: [lessons.chapterId, lessons.number], set: { ...lesson }})
}
console.log("Seeded")
await client.end() 