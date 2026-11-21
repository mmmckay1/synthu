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

let synthBus: GainNode | null = null
export function getSynthBus(): GainNode{
    if(synthBus===null){
    const ctx = getAudioContext()
    synthBus = ctx.createGain()
    synthBus.connect(getMasterGain())
    }
    return synthBus
}

let analyser: AnalyserNode | null = null
export function getAnalyser(): AnalyserNode{
    if(analyser===null){
        const ctx = getAudioContext()
        analyser = ctx.createAnalyser()
        analyser.fftSize = 2048
        getSynthBus().connect(analyser)
    }
    return analyser
}

