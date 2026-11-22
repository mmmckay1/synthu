import { type LessonRecord } from '@synthu/shared'
import Freeplay from './Freeplay.tsx'
import { Lesson } from './Lesson.tsx'
import { useEffect, useState } from 'react'
import { useSession } from './useSession.ts'
import { AuthForm } from './AuthForm.tsx'
import { supabase } from './supabase.ts'
import { apiFetch } from './api.ts'
import { Routes, Route, Link } from 'react-router'

function App() {
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
    <Link to="/">Freeplay</Link>
    <Link to="/courses">Lessons</Link>
      {/* <p>You can do it tootall! -Mama, Froggie, Binky, Minky</p> */}
      <Routes>
        <Route path="/" element= {<Freeplay/>} />
        <Route path="/courses" element={lessonView} />
      </Routes>
    </>
  )
}
export default App