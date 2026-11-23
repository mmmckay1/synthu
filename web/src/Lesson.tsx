import { lessonStartPatch, type LessonRecord, type Patch, type ScoreResult } from "@synthu/shared"
import { useState } from "react"
import { SynthPanel } from "./SynthPanel"
import { noteOff, noteOn, type Voice } from "./audio/voice"
import { getAudioContext, getSynthBus } from "./audio/context"
import { apiFetch } from "./api"
import { Link } from "react-router"

const NOTE_MS = 1000
const GIVE_UP_AFTER = 4
let current: { voice: Voice, patch: Patch, timer: number } | null = null

const playPatch = async (p: Patch) => {
    const ctx = getAudioContext()
    await ctx.resume()
    if (current) {
        clearTimeout(current.timer)
        noteOff(ctx, current.voice, current.patch)
    }
    const voice = noteOn(ctx, p, 220, getSynthBus())
    const timer = setTimeout(() => {
        noteOff(ctx, voice, p)
        current = null
    }, NOTE_MS)
    current = { voice, patch: p, timer }

}

export function Lesson({ lesson, nextLessonId }: { lesson: LessonRecord, nextLessonId: number | null }) {
    const [patch, setPatch] = useState<Patch>(() => lessonStartPatch(lesson))
    const [attempts, setAttempts] = useState(0)
    const [result, setResult] = useState<ScoreResult | null>(null)
    const [gaveUp, setGaveUp] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const done = result?.passed === true || gaveUp

    const setParameter = <K extends keyof Patch>(key: K, value: Patch[K]) => {
        const next = { ...patch, [key]: value }
        setPatch(next)
    }

    const handleSubmit = async () => {
        setError(null)
        setSaving(true)
        try {
            const res = await apiFetch("/attempts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId: lesson.lessonId, patch })
            })
            if (!res.ok) {
                setError("Couldn't save your attempt. Try again")
                return
            }
            const score: ScoreResult = await res.json()
            setResult(score)
            if (score.passed) {
                setPatch(lesson.targetPatch)
            }
            setAttempts(a => a + 1)
        }
        catch { setError("Couldn't reach the server, check your connection and try again.") }
        finally { setSaving(false) }
    }

    const handleGiveUp = async () => {
        setError(null)
        setSaving(true)
        try {
            const res = await apiFetch("/attempts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId: lesson.lessonId, patch, gaveUp: true })
            })
            if (!res.ok) {
                setError("Couldn't save, try again")
                return
            }
            setGaveUp(true)
            setPatch(lesson.targetPatch)
        }
        catch { setError("Couldn't reach the server, check your connection and try again.") }
        finally { setSaving(false) }
    }

    return (<>
        <h1>{lesson.title}</h1>
        <p>{lesson.introText}</p>
        {error && <p>{error}</p>}
        <div className="row">
            <button onClick={() => playPatch(lesson.targetPatch)}>Play Target</button>
            <button onClick={() => playPatch(patch)}>Play my patch</button>
            <button onClick={() => void handleSubmit()} disabled={done || saving} >Submit</button>
            {attempts >= GIVE_UP_AFTER && !done && <button onClick={() => void handleGiveUp()} disabled={saving}>Give Up?  </button>}
        </div>
        <div className="panel">
            <SynthPanel patch={patch} onChange={setParameter} unlocked={done ? [] : lesson.unlockedParameters} />
        </div>
        {result && (
            <div>
                <h2>{gaveUp ? "Here's the correct patch:" : result.passed ? "Matched!" : "Not yet"}</h2>
                {!done && <p>Attempts: {attempts}</p>}
                <ul>{gaveUp ? lesson.unlockedParameters.map(k => <li key={k}>{k}: {lesson.targetPatch[k]} </li>) :
                    result.controls.map(c => <li key={c.key}>{c.key}:{c.band}</li>)}</ul>
            </div>
        )
        }
        {done && <p>{lesson.explanation}</p>}
        {done && (nextLessonId !== null ? <Link to={`/courses/${nextLessonId}`}>Next Lesson</Link> : <Link to="/courses">Back to all lessons</Link>)}
    </>
    )
}

