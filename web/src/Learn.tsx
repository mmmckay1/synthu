import { apiFetch } from './api.ts'
import { Lesson } from './Lesson.tsx'
import { useEffect, useState } from 'react'
import { useSession } from './useSession.ts'
import type { ChapterRecord, LessonRecord } from '@synthu/shared'
import { AuthForm } from './AuthForm.tsx'
import { supabase } from './supabase.ts'
import { useParams, Link } from 'react-router'


export function Learn() {
  const { lessonId, chapterId } = useParams()
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
  else if (!chapterId){
    lessonView = ( <>
    <h1>fill</h1>
    <p>fill</p>
    <ul>
      {chapters.map(c => (
        <li key={c.chapterId}>
          <Link to={ `/courses/${c.chapterId}`}>Chapter {c.number}: {c.title}</Link>
        </li>
      ))}
    </ul>
    </>
    )
  }
  else if (!lessonId){
    const chapter = chapters.find(c => c.chapterId === Number(chapterId))
    const chapterLessons = lessons.filter(l => l.chapterId === Number(chapterId))
    lessonView = chapter ? 
    (<>
      <h2>{chapter.title}</h2>
      <p>{chapter.introText}</p>
    <ul>
        {chapterLessons.map(l => (
            <li key={l.lessonId}>
                <Link to={ `/courses/${chapter.chapterId}/${l.lessonId}`}>{l.title}</Link>
            </li>
        ))}
    </ul>
    </>
    )
   : <p>Chapter not found</p>
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