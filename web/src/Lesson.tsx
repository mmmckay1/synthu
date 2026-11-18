import { lessonStartPatch, type Lesson as LessonData, type Patch, } from "@synthu/shared"
import { useState, useRef } from "react"
import { SynthPanel } from "./SynthPanel"
import { type Voice, noteOff, noteOn, updateVoice } from "./audio/voice"
import { getAudioContext, getMasterGain } from "./audio/context"

const NOTE_MS = 1000

const playPatch = async (p: Patch) => {
    const ctx = getAudioContext()
    await ctx.resume()
    const voice = noteOn(ctx, p, 220, getMasterGain())
    setTimeout(() => noteOff(ctx, voice, p), NOTE_MS)

}

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
        <div className="row">
            <button onClick={() => playPatch(lesson.targetPatch)}>Play Target</button>
            <button onClick={() => playPatch(patch)}>Play my patch</button>
        </div>
        <div className="panel">

            <SynthPanel patch={patch} onChange={setParameter} unlocked={lesson.unlockedParameters} />
        </div>
    </>
    )
}

