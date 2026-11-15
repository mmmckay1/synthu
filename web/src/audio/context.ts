let audioCtx: AudioContext | null = null
export function getAudioContext(): AudioContext {
    if (audioCtx === null){
        audioCtx = new AudioContext()
    }
    return audioCtx
}

let masterGain: GainNode | null = null
export function getMasterGain(): GainNode{
    if(masterGain=== null){
        const ctx = getAudioContext()
        masterGain = ctx.createGain()
        masterGain.connect(ctx.destination)
        masterGain.gain.value = 0.5**3
    }
    return masterGain
}