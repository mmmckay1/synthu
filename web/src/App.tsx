import { type LessonRecord } from '@synthu/shared'
import Freeplay from './Freeplay.tsx'
import { Lesson } from './Lesson.tsx'
import { useEffect, useState } from 'react'
import { useSession } from './useSession.ts'
import { AuthForm } from './AuthForm.tsx'
import { supabase } from './supabase.ts'
import { apiFetch } from './api.ts'

function App() {
  const [page, setPage] = useState<"freeplay" | "lesson">("freeplay")
  const session = useSession()
  const authLabel = session === undefined ? "Loading..." : session ? `Logged in as ${session.user.email}`: "Not logged in"
  const [whoami, setWhoami] = useState<string | null>(null)
  const [ lessons, setLessons ] = useState<LessonRecord[] | null>(null)

  useEffect(() =>{
    if(session){
      apiFetch("/lessons").then(r => r.json()).then(setLessons)
    }
  }, [session])

  let lessonView
  if(!session) lessonView = <p>Log in to take lessons</p>
  else if (!lessons || !lessons[0]) lessonView = <p>Loading lessons....</p>
  else lessonView = <Lesson lesson={lessons[0]}/>

  async function checkWhoami() {
    const res = await apiFetch("/me")
    const body = await res.json()
    setWhoami(`${res.status}: ${JSON.stringify(body)}`)
    
  }

  return (
    <>
    <p>{authLabel}</p>
    { session === null && <AuthForm/>}
    { session && <button onClick={() => void supabase.auth.signOut()}>Log out</button>}
    { session && <button onClick={() => void checkWhoami()}> Who am I?</button>}
    { whoami && <p>{whoami}</p>}
    <button onClick={() => setPage("freeplay")}>Freeplay Synth</button>
    <button onClick={() => setPage("lesson")}>Lessons</button>
      {/* <p>You can do it tootall! -Mama, Froggie, Binky, Minky</p> */}
      {page === "freeplay" ? <Freeplay /> : lessonView }
    </>
  )
}
export default App