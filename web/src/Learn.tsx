import { apiFetch } from './api.ts'
import { Lesson } from './Lesson.tsx'
import { useEffect, useState } from 'react'
import { useSession } from './useSession.ts'
import type { ChapterRecord, LessonRecord } from '@synthu/shared'
import { AuthForm } from './AuthForm.tsx'
import { supabase } from './supabase.ts'
import { useParams, Link } from 'react-router'

function isUnlocked(lessons: LessonRecord[], completed: number[], lesson: LessonRecord){
  const prev = lessons[lessons.indexOf(lesson) -1]
  return !prev || completed.includes(prev.lessonId)
}

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
    lessonView = ( <div className='learn-home'>
      < div className='section intro'>
      <h1>Introduction to Synthesis</h1>
      <p>Insert text here</p>
      </div>
      <div className='section'>
    <h2>Chapters</h2>
    <ol>
      {chapters.map(c => (
        <li key={c.chapterId}>
          <Link to={ `/courses/${c.chapterId}`}>{c.title}</Link>
        </li>
      ))}
    </ol>
    </div>
    </div>
    )
  }
  else if (!lessonId){
    const chapter = chapters.find(c => c.chapterId === Number(chapterId))
    const chapterLessons = lessons.filter(l => l.chapterId === Number(chapterId))
    lessonView = chapter ? 
    (<>
      <Link className="back-link" to="/courses">Back to Learning Home</Link>
      <div className='section'>
      <h2>{chapter.title}</h2>
      <p>{chapter.introText}</p>
    <ol>
        {chapterLessons.map(l => (
            <li key={l.lessonId}>
                {isUnlocked(lessons, completed, l) ? <Link to={ `/courses/${chapter.chapterId}/${l.lessonId}`}>{l.title}</Link> : <span className='locked'>{l.title}</span>}
              {completed.includes(l.lessonId) && " ✓"}
            </li>
        ))}
    </ol>
    </div>
    </>
    )
   : <p>Chapter not found</p>
  }
  else {
    const index = lessons.findIndex(l => l.lessonId ===Number(lessonId))
    const found = lessons[index]
    const next = lessons[index+1]
    const nextLessonId = found && next && (next.chapterId ===found.chapterId) ? next.lessonId : null
    if (!found){
     lessonView = <p>Lesson not found</p>
    }
    else if (!isUnlocked(lessons, completed, found)){
      lessonView = <p>Finish the previous lesson first!</p>
    }
    else{
    lessonView = <Lesson lesson={found} key={found.lessonId} nextLessonId={nextLessonId} onComplete={()=> setCompleted(c => c ? [...c, found.lessonId] : c)} alreadyCompleted={completed.includes(found.lessonId)}/> 
  }
}

    return<>
    <div className='page'>
    <p>{authLabel}</p>
    { session === null && <AuthForm/>}
    { session && <button onClick={() => void supabase.auth.signOut()}>Log out</button>}
    {lessonView}
    </div>
    </>
}