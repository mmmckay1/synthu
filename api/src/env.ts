import { z } from "zod"

export const EnvSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().int().default(3000),
    CORS_ORIGINS: z.string().default("http://localhost:5173")
})

export const env = EnvSchema.parse(process.env)