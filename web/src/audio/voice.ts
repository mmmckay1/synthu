import type { Patch } from "@synthu/shared"

export type Voice = {
    osc: OscillatorNode,
    amp: GainNode
}

export function noteOn(ctx: AudioContext, patch: Patch, freq: number): Voice {
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

export function noteOff(ctx: AudioContext, voice: Voice, patch: Patch): void {
    const now = ctx.currentTime
    const releaseSec = patch.ampRelease/1000
    voice.amp.gain.cancelScheduledValues(now)
    voice.amp.gain.setValueAtTime(voice.amp.gain.value, now)
    voice.amp.gain.linearRampToValueAtTime(0, now + releaseSec)
    voice.osc.stop(now+releaseSec)
}
