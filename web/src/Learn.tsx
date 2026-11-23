import { apiFetch } from './api.ts'
import { Lesson } from './Lesson.tsx'
import { useEffect, useState } from 'react'
import { useSession } from './useSession.ts'
import type { ChapterRecord, LessonRecord } from '@synthu/shared'
import { AuthForm } from './AuthForm.tsx'
import { supabase } from './supabase.ts'
import { useParams, Link } from 'react-router'


export function Learn() {
  const { lessonId } = useParams()
  const session = useSession()
  const authLabel = session === undefined ? "Loading..." : session ? `Logged in as ${session.user.email}`: "Not logged in"
  const [ lessons, setLessons ] = useState<LessonRecord[] | null>(null)
  const [ chapters, setChapters ] = useState<ChapterRecord[] | null>(null)
  const [ completed, setCompleted ] = useState<number[] | null>(null)

  useEffect(() =>{
    if(session){
      Promise.all([
      apiFetch("/lessons").then(r => r.json()),
            apiFetch("/chapters").then(r => r.json()),
                  apiFetch("/completed").then(r => r.json())
      ]).then(([l, c, done ]) => {
        setLessons(l)
        setChapters(c)
        setCompleted(done)
      })

    }
  }, [session])
  
  let lessonView
  
  if(!session) {
    lessonView = <p>Log in to take lessons</p>
  }
  else if (!lessons || !chapters || !completed) {
    lessonView = <p>Loading lessons....</p>
  }
  else if (!lessonId){
    lessonView = 
    <ul>
        {lessons.map(l => (
            <li key={l.lessonId}>
                <Link to={ `/courses/${l.lessonId}`}>{l.title}</Link>
            </li>
        ))}
    </ul>
  }
  else {
    const index = lessons.findIndex(l => l.lessonId ===Number(lessonId))
    const found = lessons[index]
    const next = lessons[index+1]
    const nextLessonId = found && next && (next.chapterId ===found.chapterId) ? next.lessonId : null
    lessonView = found ? (<Lesson lesson={found} key={found.lessonId} nextLessonId={nextLessonId}/>) : <p>Lesson not found</p>
  }

    return<>
    <p>{authLabel}</p>
    { session === null && <AuthForm/>}
    { session && <button onClick={() => void supabase.auth.signOut()}>Log out</button>}
    {lessonView}
    </>
}