import { supabase } from "./supabase"

const API_URL = import.meta.env.VITE_API_URL

if(!API_URL) throw new Error("Missing VITE_API_URL")

export async function apiFetch(path: string, init: RequestInit = {}) {
    const { data } = await supabase.auth.getSession()
    const headers = new Headers(init.headers)
    if(data.session){
        headers.set("Authorization", `Bearer ${data.session.access_token}` )
    }
    return fetch(`${API_URL}${path}`, { ...init, headers})
}