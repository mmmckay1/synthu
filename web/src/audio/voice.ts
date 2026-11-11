import type { Patch } from "@synthu/shared"

export function noteOn(ctx: AudioContext, patch: Patch, freq: number){
    const osc = ctx.createOscillator()
    const amp = ctx.createGain()
    const now = ctx.currentTime
    const attackSec = patch.ampAttack/1000
    const decaySec = patch.ampDecay/1000
    osc.connect(amp)
    amp.connect(ctx.destination)
    osc.type = patch.osc1Waveform
    osc.frequency.value = freq
    amp.gain.setValueAtTime(0, now)
    amp.gain.linearRampToValueAtTime(1, now + attackSec)
    amp.gain.linearRampToValueAtTime(patch.ampSustain, now + attackSec + decaySec)
    osc.start(now)
    return { osc, amp}
}

export type Voice = {
    osc: OscillatorNode,
    gain: GainNode
}