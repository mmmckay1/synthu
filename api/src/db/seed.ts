import { db, client } from "./index.js"
import { chapters, lessons } from "./schema.js"
import { CHAPTER_1, CHAPTER_1_LESSONS, CHAPTER_2, CHAPTER_2_LESSONS } from "@synthu/shared"

const CONTENT = [
    { chapter: CHAPTER_1, chapterLessons: CHAPTER_1_LESSONS },
    { chapter: CHAPTER_2, chapterLessons: CHAPTER_2_LESSONS }
]

for (const { chapter: content, chapterLessons } of CONTENT) {
    const [chapter] = await db.insert(chapters).values(content).onConflictDoUpdate({ target: chapters.number, set: { ...content } }).returning()
    for (const lesson of chapterLessons) {
        await db.insert(lessons).values({ ...lesson, chapterId: chapter.chapterId }).onConflictDoUpdate({ target: [lessons.chapterId, lessons.number], set: { ...lesson } })
    }
}
console.log("Seeded")
await client.end() 
