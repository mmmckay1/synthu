import { describe, it, expect } from "vitest";
import { type Lesson, lessonStartPatch } from "./lesson.js"
import { DEFAULT_PATCH } from "./patch.js";
import { scorePatch } from "./scoring.js"

const TEST_LESSON: Lesson = {
    title:"test",
    introText:"test",
    explanation: "Test",
    targetPatch: { ...DEFAULT_PATCH, osc1Waveform: "sawtooth", filterCutoff: 1000},
    unlockedParameters: ["osc1Waveform"]
}

describe("lessonStartPatch", () =>{
    const lesson: Lesson = { ...TEST_LESSON, targetPatch: {...DEFAULT_PATCH, osc1Waveform: "square", filterCutoff: 1000, ampAttack: 200 }, unlockedParameters: ["osc1Waveform", "filterCutoff"]}
    const start = lessonStartPatch(lesson)
    it("keeps locked keys at target value", () =>{
        expect(start.ampAttack).toBe(lesson.targetPatch.ampAttack)
    })

    it("resets unlocked keys to default", ()=>{
        expect(start.osc1Waveform).toBe(DEFAULT_PATCH.osc1Waveform)
        expect(start.filterCutoff).toBe(DEFAULT_PATCH.filterCutoff)
    })

    it("test lesson does not start already passing", ()=>{
        const sampleStart = lessonStartPatch(TEST_LESSON)
        const result = scorePatch(TEST_LESSON.targetPatch, sampleStart, TEST_LESSON.unlockedParameters)
            expect(result.passed).toBe(false)
    })
})