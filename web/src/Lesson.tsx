import { lessonStartPatch, type Lesson as LessonData, type Patch, } from "@synthu/shared"
import { useState, useRef } from "react"
import { SynthPanel } from "./SynthPanel"
import { type Voice, updateVoice } from "./audio/voice"
import { getAudioContext } from "./audio/context"


export function Lesson({ lesson }: { lesson: LessonData }) {
    const [patch, setPatch] = useState<Patch>(() => lessonStartPatch(lesson))
    const voiceRef = useRef<Voice | null>(null)

    const setParameter = <K extends keyof Patch>(key: K, value: Patch[K]) => {
        const next = { ...patch, [key]: value }
        setPatch(next)
        if (voiceRef.current) {
            updateVoice(getAudioContext(), voiceRef.current, next)
        }
    }
    return (<>
        <h1>{lesson.title}</h1>
        <p>{lesson.introText}</p>
        <div className="panel">
            <SynthPanel patch={patch} onChange={setParameter} unlocked={lesson.unlockedParameters} />
        </div>
    </>
    )
}

