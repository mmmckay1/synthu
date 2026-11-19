import { describe, it, expect } from "vitest";
import { SAMPLE_LESSON, type Lesson, lessonStartPatch } from "./lesson.js"
import { DEFAULT_PATCH } from "./patch.js";
import { scorePatch } from "./scoring.js"

describe("lessonStartPatch", () =>{
    const lesson: Lesson = { ...SAMPLE_LESSON, targetPatch: {...DEFAULT_PATCH, osc1Waveform: "square", filterCutoff: 1000, ampAttack: 200 }, unlockedParameters: ["osc1Waveform", "filterCutoff"]}
    const start = lessonStartPatch(lesson)
    it("keeps locked keys at target value", () =>{
        expect(start.ampAttack).toBe(lesson.targetPatch.ampAttack)
    })

    it("resets unlocked keys to default", ()=>{
        expect(start.osc1Waveform).toBe(DEFAULT_PATCH.osc1Waveform)
        expect(start.filterCutoff).toBe(DEFAULT_PATCH.filterCutoff)
    })

    it("sample lesson does not start already passing", ()=>{
        const sampleStart = lessonStartPatch(SAMPLE_LESSON)
        const result = scorePatch(SAMPLE_LESSON.targetPatch, sampleStart, SAMPLE_LESSON.unlockedParameters)
            expect(result.passed).toBe(false)
    })
})