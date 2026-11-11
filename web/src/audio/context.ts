let audioCtx: AudioContext | null = null
export function getAudioContext(): AudioContext {
    if (audioCtx === null){
        audioCtx = new AudioContext()
    }
    return audioCtx
}