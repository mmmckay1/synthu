import { DEFAULT_PATCH, type Patch } from "./patch.js"

export type Lesson = {
    title: string
    introText: string
    targetPatch: Patch
    unlockedParameters: (keyof Patch)[]
    explanation: string,
    startPatch?: Partial<Patch> | null
}

function resetToStart<K extends keyof Patch>(patch: Patch, key: K, startPatch?: Partial<Patch> | null): void {
    patch[key] = startPatch?.[key] ?? DEFAULT_PATCH[key]
}

export function lessonStartPatch(lesson: Lesson): Patch {
    const start = {...lesson.targetPatch}
    for(const key of lesson.unlockedParameters){
        resetToStart(start, key, lesson.startPatch)    
    }
    return start
}

export type LessonRecord = Lesson & {
    lessonId: number
    chapterId: number
    number: number
}

export type ChapterRecord = {
    chapterId: string
    number: number
    title: string
    introText: string
}