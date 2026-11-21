import { db, client } from "./index.js"
import { chapters, lessons } from "./schema.js"
import { SAMPLE_LESSON } from "@synthu/shared"

const [ chapter ] = await db.insert(chapters).values({ title: "Waveforms", number: 1, introText: "..."}).onConflictDoUpdate({ target: chapters.number, set: { title: "Waveforms", introText: "..."}}).returning()
await db.insert(lessons).values({ ...SAMPLE_LESSON, chapterId: chapter.chapterId, number: 1}).onConflictDoUpdate({ target: [lessons.chapterId, lessons.number], set: { ...SAMPLE_LESSON }})
console.log("Seeded")
await client.end() 