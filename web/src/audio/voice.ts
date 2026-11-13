import type { FilterType, Patch } from "@synthu/shared"

export type Voice = {
    osc1: OscillatorNode,
    osc2: OscillatorNode,
    gain1: GainNode,
    gain2: GainNode,
    filter: BiquadFilterNode,
    amp: GainNode
}

function resonanceToQ(resonance: number, type: FilterType): number{
    switch(type){
        case "lowpass":
        case "highpass":
            return (-3 + 23*resonance)
        case "bandpass":
            return (0.5*40**resonance)
        case "none":
            return 1
    }
}

export function noteOn(ctx: AudioContext, patch: Patch, freq: number): Voice {
    const now = ctx.currentTime
    const attackSec = patch.ampAttack/1000
    const decaySec = patch.ampDecay/1000

    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    const gain2 = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    const amp = ctx.createGain()

    osc1.connect(gain1)
    osc2.connect(gain2)
    gain1.connect(filter)
    gain2.connect(filter)
    filter.connect(amp)
    amp.connect(ctx.destination)


    osc1.type = patch.osc1Waveform
    osc2.type = patch.osc2Waveform
    osc1.frequency.value = freq * (2**(patch.osc1Octave))
    osc2.frequency.value = (freq * (2**(patch.osc2Octave)))
    osc2.detune.value = patch.osc2Detune
    gain1.gain.value = (patch.osc1Mix)
    gain2.gain.value = (patch.osc2Mix)
    filter.frequency.value = (patch.filterCutoff)
    filter.type = (patch.filterType) === 'none' ? 'allpass' : patch.filterType
    filter.Q.value = resonanceToQ(patch.filterResonance, patch.filterType)

    amp.gain.setValueAtTime(0, now)
    amp.gain.linearRampToValueAtTime(1, now + attackSec)
    amp.gain.linearRampToValueAtTime(patch.ampSustain, now + attackSec + decaySec)

    osc1.start(now)
    osc2.start(now)
    return { osc1, osc2, gain1, gain2, filter, amp}
}

export function noteOff(ctx: AudioContext, voice: Voice, patch: Patch): void {
    const now = ctx.currentTime
    const releaseSec = patch.ampRelease/1000
    voice.amp.gain.cancelScheduledValues(now)
    voice.amp.gain.setValueAtTime(voice.amp.gain.value, now)
    voice.amp.gain.linearRampToValueAtTime(0, now + releaseSec)
    voice.osc1.stop(now+releaseSec)
    voice.osc2.stop(now+releaseSec)
}
