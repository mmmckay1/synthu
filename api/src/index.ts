import express from 'express';
import { env } from "./env.js"
import { db } from "./db/index.js"
import { lessons } from "./db/schema.js"
import { asc } from 'drizzle-orm';
import cors from "cors"
import { requireAuth } from './auth.js';

const app = express();
app.use(cors({ origin: env.CORS_ORIGINS.split(",")}))

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

app.get("/me", requireAuth, (_req, res) => { res.json({ userId: res.locals.userId})
})

app.listen(env.PORT, () =>{
    console.log(`Server is running on ${env.PORT}`)
}); 