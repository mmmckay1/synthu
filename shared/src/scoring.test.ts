import { describe, expect, it } from "vitest";
import { controlError, gradeError, TOLERANCES, scorePatch } from "./scoring.js"
import { DEFAULT_PATCH, type Patch } from "./patch.js";

describe("controlError", () =>{
    it("log2: one tolerance off is e = 1", () => {
        const e = controlError(TOLERANCES.filterCutoff, 1000, 1000*2**(1/6))
        expect(e).toBeCloseTo(1)
    })

    it("linear: 0.05 off on sustain is e = 1", () =>{
        const e = controlError(TOLERANCES.ampSustain, 0.8, 0.85)
        expect(e).toBeCloseTo(1)
    })

    it("time: 20% off is e = 1", ()=> {
        const e = controlError(TOLERANCES.ampAttack, 1000, 1200) 
        expect(e).toBeCloseTo(1)
    })
    it("time floor: short times use 20 ms minimum", ()=>{
        const e = controlError(TOLERANCES.ampAttack, 1, 21)
        expect(e).toBeCloseTo(1)
    })
    it("exact match: correct answer is 0", ()=>{
        const e = controlError(TOLERANCES.osc1Waveform, "sine", "sine")
        expect(e).toBe(0)
    })
    it("exact miss: any incorrect answer is e =4", ()=>{
        const e = controlError(TOLERANCES.osc1Waveform, "sine", "square")
        expect(e).toBe(4)
    })
    it("throws: numeric rule given string", ()=>{ 
        expect(() => controlError(TOLERANCES.ampSustain, "sine", 0.5)).toThrow()
    })
})

describe("gradeError", () =>{
    it("e = 1 is still a match", ()=> {
        expect(gradeError(1)).toEqual({ score: 1, band: "match"})
    })
    it("e = 2 is halfway through close", ()=>{
        expect(gradeError(2)).toEqual({ score: 0.5, band: "close"})

    })
    it("e = 3 is the last close, score 0", ()=>{
        expect(gradeError(3)).toEqual({ score: 0, band: "close"})
    })
    it ("e just over 3 is far", ()=>{
        expect(gradeError(3.01)).toEqual({ score: 0, band: "far"}
        )
    })
})

describe("scorePatch", ()=>{
    it("one far control fails", ()=>{
        const attempt: Patch = {...DEFAULT_PATCH, filterCutoff: 1000}
        const r = scorePatch(DEFAULT_PATCH, attempt, ["filterCutoff"])
        expect(r.passed).toBe(false)
        expect(r.overall).toBe(0)
    })

    it("perfect", ()=>{
        const r = scorePatch(DEFAULT_PATCH, DEFAULT_PATCH, ["filterCutoff"])
        expect(r.passed).toBe(true)
        expect(r.overall).toBe(100)
    })

    it("ungraded controls are ignored", ()=>{
        const attempt: Patch = {...DEFAULT_PATCH, osc1Waveform: "square"}
        const r = scorePatch(DEFAULT_PATCH, attempt, ["filterCutoff"])
        expect(r.passed).toBe(true)
        expect(r.overall).toBe(100)
    })

    it("weights", ()=>{
        const attempt: Patch = {...DEFAULT_PATCH, filterCutoff: 20000*2**(-2/6)} 
        const r = scorePatch(DEFAULT_PATCH, attempt, ["filterCutoff", "filterResonance"], { filterCutoff: 2})
        expect(r.passed).toBe(false)
        expect(r.overall).toBeCloseTo(66.67, 1)
    })

    it("empty graded throws", ()=>{
        expect(() => scorePatch(DEFAULT_PATCH, DEFAULT_PATCH, [])).toThrow()
    })
})