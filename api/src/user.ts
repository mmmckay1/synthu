import { db } from "./db/index.js"
import { users } from "./db/schema.js"

export async function ensureUser(userId: string) {
    await db.insert(users).values({ userId, username: `user-${userId.slice(0, 8)}` }).onConflictDoNothing({ target: users.userId})
}