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

  return (
    <>
    <p>{authLabel}</p>
    { session === null && <AuthForm/>}
    { session && <button onClick={() => void supabase.auth.signOut()}>Log out</button>}
    <button onClick={() => setPage("freeplay")}>Freeplay Synth</button>
    <button onClick={() => setPage("lesson")}>Lessons</button>
      {/* <p>You can do it tootall! -Mama, Froggie, Binky, Minky</p> */}
      {page === "freeplay" ? <Freeplay /> : lessonView }
    </>
  )
}
export default App