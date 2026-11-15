import type { Patch } from "./patch.js"

export type Band = "match" | "close" | "far"

export type ControlResult = {
    key: keyof Patch
    target: Patch[keyof Patch]
    attempt: Patch[keyof Patch]
    error: number
    score: number
    band: Band
}

export type ScoreResult = {
    controls: ControlResult[]
    overall: number
    passed: boolean
}

export type ToleranceRule = 
    | { kind: "log2"; tolerance: number }
    | { kind: "linear"; tolerance: number }
    | { kind: "time"; minMs: number, ratio: number}
    | { kind: "exact"}

export const TOLERANCES: Record<keyof Patch, ToleranceRule> = {
        osc1Waveform: { kind: "exact"},
        osc2Waveform: { kind: "exact"},
        osc1Mix: { kind: "linear", tolerance: 0.05 },
        osc2Mix: { kind: "linear", tolerance: 0.05 },
        osc2Detune: { kind: "linear", tolerance: 5 },
        osc1Octave: { kind: "exact"},
        osc2Octave: { kind: "exact"},
        ampAttack: { kind: "time", minMs: 20, ratio: 0.2 },
        ampDecay: { kind: "time", minMs: 20, ratio: 0.2 },
        ampSustain: { kind: "linear", tolerance: 0.05 } ,
        ampRelease: { kind: "time", minMs: 20, ratio: 0.2 },
        filterType: { kind: "exact"},
        filterCutoff: { kind: "log2", tolerance: 1/6 },
        filterResonance: { kind: "linear", tolerance: 0.05 }
}

export function controlError(rule: ToleranceRule, target: Patch[keyof Patch], attempt: Patch[keyof Patch]): number{
    const MISS = 4

    if (rule.kind === "exact"){
        if (target === attempt){
            return 0
        }
        return MISS
    }

    if ((typeof attempt !== "number") || (typeof target !== "number")){
        throw new Error(`expected numbers, got ${target} and ${attempt}`)
    
    }

    switch(rule.kind){
        case "log2":
            return (Math.abs(Math.log2(attempt / target))/rule.tolerance)
        case "linear":
            return Math.abs((attempt - target)/ rule.tolerance)
        case "time":
            return (Math.abs(attempt - target))/Math.max(rule.minMs, rule.ratio*target)
    }

}

export function gradeError(e: number): {score: number, band: Band}{
    if (e<=1){
        return{score: 1, band: "match"}
    }
    if (e <=3){
        return {score: -0.5*e+1.5, band: "close"}
    }
    return {score: 0, band: "far"}
}

export function scorePatch(target: Patch, attempt: Patch, graded: (keyof Patch)[], weights?: Partial<Record<keyof Patch, number>>): ScoreResult{
    if (graded.length === 0){
        throw new Error("Graded is empty")
    }

    const controls: ControlResult[] = graded.map((key) => {
        const rule = TOLERANCES[key]
        const e = controlError(rule, target[key], attempt[key])
        const { score , band } = gradeError(e)
        return { key, target: target[key], attempt: attempt[key], error: e, score, band}

    })

    let total = 0
    let totalWeight = 0
    for (const c of controls){
        const w = weights?.[c.key] ?? 1
        total += (w * c.score)
        totalWeight += w
    }
    const overall = (total/totalWeight)*100 
    const passed = controls.every((c) => c.band ==="match")
    return { controls, overall, passed}
}