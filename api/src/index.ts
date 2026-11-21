import express from 'express';
import { env } from "./env.js"
import { db } from "./db/index.js"
import { attempts, lessons } from "./db/schema.js"
import { asc, eq } from 'drizzle-orm';
import cors from "cors"
import { requireAuth } from './auth.js';
import { ensureUser } from './user.js';
import { PatchSchema, scorePatch } from '@synthu/shared';
import { z } from "zod"

const app = express();
app.use(cors({ origin: env.CORS_ORIGINS.split(",")}))
app.use(express.json())

const attemptBody = z.object({ lessonId: z.number().int().positive(), patch: PatchSchema, gaveUp: z.boolean().default(false)})

app.post('/attempts', requireAuth, async (req, res) => {
    const parsed = attemptBody.safeParse(req.body)
    if (!parsed.success){
        res.status(400).json({ error: "Invalid attempt", issues: parsed.error.issues})
        return
    }
    const { lessonId, patch, gaveUp } = parsed.data
    const userId = res.locals.userId
    await ensureUser(userId)
    const [lesson] = await db.select().from(lessons).where(eq(lessons.lessonId, lessonId))
    if (!lesson){
        res.status(404).json({ error: "Lesson not found" })
        return
    }
    const result = scorePatch(lesson.targetPatch, patch, lesson.unlockedParameters)
    const passed = !gaveUp && result.passed
    await db.insert(attempts).values({ userId, lessonId, submittedPatch: patch, score: result.overall, passed, gaveUp})
    res.status(201).json({ ...result, passed})
})

app.get('/health', (_req, res): void =>{
    res.json({
        "ok": true,
    })
}
)

app.get("/lessons", async (_req, res) => {
    const rows = await db.select().from(lessons).orderBy(asc(lessons.chapterId), asc(lessons.number))
    res.json(rows)
})

app.listen(env.PORT, () =>{
    console.log(`Server is running on ${env.PORT}`)
}); 