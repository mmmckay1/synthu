import { AuthForm } from "./AuthForm";
import { useSession } from "./useSession";
import { supabase } from "./supabase";
import { useState, useEffect } from "react";
import type { LessonRecord, ChapterRecord } from "@synthu/shared";
import { apiFetch } from "./api";

export function Profile(){
    const [ lessons, setLessons ] = useState<LessonRecord[] | null>(null)
    const [ chapters, setChapters ] = useState<ChapterRecord[] | null>(null)
    const [ completed, setCompleted ] = useState<number[] | null>(null)
    const session = useSession()

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

    return(
        <div className="page">
            {session === null && <AuthForm/>}
            {session && (<>
                <h1>Profile</h1>
                <p>{session.user.email}</p>
                {lessons && chapters && completed && (<>
                    <h2>Progress</h2>
                    <ul>
                        {chapters.map( c => {
                            const chapterLessons = lessons.filter(l => l.chapterId === c.chapterId)
                            const done = chapterLessons.filter(l => completed.includes(l.lessonId)).length
                            return(
                                <li key={c.chapterId}>{c.title}: {done} / {chapterLessons.length} lessons.</li>
                            )
                            })}
                    </ul>
                </>)}
                <button onClick={() => void supabase.auth.signOut()}>Log out</button>
                </>
            )}
        </div>
    )
}