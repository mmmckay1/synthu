import { useState } from "react"
import { supabase } from "./supabase"

export function AuthForm(){
    const [email, setEmail] = useState("")
    const [password, setPassword] =  useState("")
    const [mode, setMode] = useState<"login" | "signup">("login")
    const [message, setMessage] = useState<string | null>(null)

    async function handleSubmit() {
        setMessage(null)

        if (mode === "signup"){
            const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin },
            })
            if (error) setMessage(error.message)
        }
        else{
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) setMessage(error.message)
        }
    }
return(
        <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
            <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}</button>
            { message && <p>{message}</p>}
        </form>
    )
}
