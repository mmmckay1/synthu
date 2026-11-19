import { DEFAULT_PATCH, type Patch } from "./patch.js"

export type Lesson = {
    title: string
    introText: string
    targetPatch: Patch
    unlockedParameters: (keyof Patch)[]
    explanation: string
}

export const SAMPLE_LESSON: Lesson = {
    title: "sample title",
    introText: "This is a sample intro text.  FIll THIS IN LATER",
    targetPatch: {...DEFAULT_PATCH, osc1Waveform: "sawtooth"},
    unlockedParameters: ["osc1Waveform"],
    explanation: "this is the explanation"
}

function resetToDefault<K extends keyof Patch>(patch: Patch, key: K): void {
    patch[key] = DEFAULT_PATCH[key]
}

export function lessonStartPatch(lesson: Lesson): Patch {
    const start = {...lesson.targetPatch}
    for(const key of lesson.unlockedParameters){
        resetToDefault(start, key)    
    }
    return start
}