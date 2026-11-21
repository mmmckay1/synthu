import { createRemoteJWKSet, jwtVerify } from "jose";
import type {  Request,  Response,  NextFunction } from "express";
import { env } from "./env.js";

const JWKS = createRemoteJWKSet(new URL( `${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`))

export async function requireAuth (req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization

    if (!header || !header.startsWith("Bearer ")){
        res.status(401).json({ error: "Missing token"})
        return
    }
    const token = header.slice(7)
    try{
        const { payload } = await jwtVerify(token, JWKS, { issuer: `${env.SUPABASE_URL}/auth/v1`, audience: "authenticated"})
        if (!payload.sub){
            res.status(401).json({ error: "Invalid token"})
            return
        }
        res.locals.userId = payload.sub
    }
    catch{
        res.status(401).json({ error: "Invalid token"})
        return
    }
            next()

}