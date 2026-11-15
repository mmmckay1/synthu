import { DEFAULT_PATCH, type Patch} from "@synthu/shared";
import { useRef, useState, useEffect, useCallback } from "react";
import { noteOff, noteOn, updateVoice, type Voice } from "./audio/voice";
import { getAudioContext } from "./audio/context";
import { linearToPosition, logToPosition, positionToLinear, positionToLog } from "./audio/scale";
import Knob from "./Knob";

export default function Freeplay(){
    const [patch, setPatch] = useState<Patch>( {...DEFAULT_PATCH, osc1Waveform: "sawtooth", filterType: "lowpass"})
    const voiceRef = useRef<Voice | null>(null)
    
    const setParameter = <K extends keyof Patch>(key: K, value: Patch[K]) =>{
        const next = {...patch, [key]: value}
        setPatch(next)
        if (voiceRef.current){
            updateVoice(getAudioContext(), voiceRef.current, next)
        }
    }
    const handlePress = useCallback(async () => {
        const ctx = getAudioContext()
        await ctx.resume()
        if (voiceRef.current){
            return
        }
        voiceRef.current = noteOn(ctx, patch, 220)
    }, [patch])

    const handleRelease = useCallback(() => {
        const ctx = getAudioContext()

        if (!voiceRef.current){
            return
        }
        noteOff(ctx, voiceRef.current, patch)
        voiceRef.current = null
    }, [patch])

    useEffect(() =>{
        const onKeyDown = (e: KeyboardEvent) =>{
            if (e.code !== 'KeyA'){
                return
            }
            if (e.repeat){
                return
            }
            handlePress()
        }

        const onKeyUp = (e: KeyboardEvent) =>{
            if (e.code === 'KeyA'){
                handleRelease()
            }
        }

        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
        return ()=>{
            window.removeEventListener('keydown',onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    } ,[handlePress, handleRelease])

    return (<>
    <button onPointerDown={handlePress} onPointerUp={handleRelease} onPointerLeave={handleRelease}>Hold to play clown</button>
    {/* <input type="range" min={0} max={1} step={0.001} value={cutoffToPosition(patch.filterCutoff)} onChange={handleCutoff} />
    {Math.round(patch.filterCutoff)} Hz  */}
    <Knob label="Filter Cutoff" position={logToPosition(patch.filterCutoff, 20, 20000)} display={ `${Math.round(patch.filterCutoff)} Hz`} onChange={(p) => setParameter('filterCutoff', positionToLog(p, 20, 20000))}/>
    <Knob label="Attack" position={logToPosition(patch.ampAttack, 1, 5000)} display={ `${Math.round(patch.ampAttack)} ms`} onChange={(p) => setParameter('ampAttack', positionToLog(p, 1, 5000))} />
    <Knob label="Decay" position={logToPosition(patch.ampDecay, 1, 5000)} display={ `${Math.round(patch.ampDecay)} ms`} onChange={(p) => setParameter('ampDecay', positionToLog(p, 1, 5000))}/>
    <Knob label="Sustain" position={patch.ampSustain} display={ `${Math.round(patch.ampSustain*100)} %`} onChange={(p) => setParameter('ampSustain', p)}/>
    <Knob label="Release" position={logToPosition(patch.ampRelease, 1, 5000)} display={ `${Math.round(patch.ampRelease)} ms`} onChange={(p) => setParameter('ampRelease', positionToLog(p, 1, 5000))}/>
    <Knob label="Osc 1 Level" position={patch.osc1Mix} display={ `${Math.round(patch.osc1Mix*100)} %`} onChange={(p) => setParameter('osc1Mix', p)}/>
    <Knob label="Osc 2 Level" position={patch.osc2Mix} display={ `${Math.round(patch.osc2Mix*100)} %`} onChange={(p) => setParameter('osc2Mix', p)}/>
    <Knob label="Osc 2 Detune" position={linearToPosition(patch.osc2Detune, -100, 100)} display={ `${Math.round(patch.osc2Detune)} cents`} onChange={(p) => setParameter('osc2Detune', positionToLinear(p, -100, 100))}/>
    <Knob label="Osc 1 Octave" position={linearToPosition(patch.osc1Octave, -2, 2)} display={`${patch.osc1Octave}`} onChange={(p) => setParameter('osc1Octave', Math.round(positionToLinear(p, -2, 2)))}/>
    <Knob label="Osc 2 Octave" position={linearToPosition(patch.osc2Octave, -2, 2)} display={`${patch.osc2Octave}`} onChange={(p) => setParameter('osc2Octave', Math.round(positionToLinear(p, -2, 2)))}/>
    <Knob label="Filter Resonance" position={patch.filterResonance} display={`${Math.round(patch.filterResonance*100)} %`} onChange={(p) => setParameter('filterResonance', p)}/>
</>)}