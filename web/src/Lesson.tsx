import { lessonStartPatch, type Lesson as LessonData, type Patch, type ScoreResult, scorePatch} from "@synthu/shared"
import { useState } from "react"
import { SynthPanel } from "./SynthPanel"
import { noteOff, noteOn, type Voice } from "./audio/voice"
import { getAudioContext, getMasterGain } from "./audio/context"

const NOTE_MS = 1000
const GAVE_UP_AFTER_FOUR = 4
let current: { voice: Voice, patch: Patch, timer: number } | null = null

const playPatch = async (p: Patch) => {
    const ctx = getAudioContext()
    await ctx.resume()
    if (current){
        clearTimeout(current.timer)
        noteOff(ctx, current.voice, current.patch)
    }
    const voice = noteOn(ctx, p, 220, getMasterGain())
    const timer = setTimeout(() => { 
        noteOff(ctx, voice, p) 
        current = null
    }, NOTE_MS)
    current = { voice, patch: p, timer }

}

export function Lesson({ lesson }: { lesson: LessonData }) {
    const [patch, setPatch] = useState<Patch>(() => lessonStartPatch(lesson))
    const [attempts, setAttempts] = useState(0)
    const [result, setResult] = useState<ScoreResult | null>(null)
    const [gaveUp, setGaveUp] = useState(false)

    const done = result?.passed === true || gaveUp

    const setParameter = <K extends keyof Patch>(key: K, value: Patch[K]) => {
        const next = { ...patch, [key]: value }
        setPatch(next)
    }

    const handleSubmit = ()=>{
        const r = scorePatch(lesson.targetPatch, patch, lesson.unlockedParameters)
        setResult(r)
        if (r.passed){
            setPatch(lesson.targetPatch)
        }
        setAttempts(a => a+1)
    }

    const handleGiveUp = () =>{
        setGaveUp(true)
        setPatch(lesson.targetPatch)
    }

    return (<>
        <h1>{lesson.title}</h1>
        <p>{lesson.introText}</p>
        <div className="row">
            <button onClick={() => playPatch(lesson.targetPatch)}>Play Target</button>
            <button onClick={() => playPatch(patch)}>Play my patch</button>
            <button onClick={handleSubmit} disabled={done} >Submit</button>
            {attempts >= GAVE_UP_AFTER_FOUR && !done && <button onClick={handleGiveUp}>Give Up?  </button>}
        </div>
        <div className="panel">
            <SynthPanel patch={patch} onChange={setParameter} unlocked={done ? [] : lesson.unlockedParameters} />
        </div>
        {result && ( 
        <div>
            <h2>{gaveUp ? "here is is:" :result.passed? "Matched!" : "Not yet"}</h2>
            { !done && <p>Attempts: {attempts}</p> }
            <ul>{ gaveUp ? lesson.unlockedParameters.map(k => <li key={k}>{k}: {lesson.targetPatch[k]} </li>): 
                result.controls.map(c => <li key={c.key}>{c.key}:{c.band}</li>)}</ul>
        </div>
        )
        }
        {done && <p>{lesson.explanation}</p>}
    </>
    )
}

