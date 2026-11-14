import { DEFAULT_PATCH, type Patch} from "@synthu/shared";
import { useRef, useState } from "react";
import { noteOff, noteOn, updateVoice, type Voice } from "./audio/voice";
import { getAudioContext } from "./audio/context";
import { cutoffToPosition, positionToCutoff } from "./audio/scale";
import { useEffect } from "react";

export default function Freeplay(){
    const [patch, setPatch] = useState<Patch>( {...DEFAULT_PATCH, osc1Waveform: "sawtooth", filterType: "lowpass"})
    const voiceRef = useRef<Voice | null>(null)

    const handlePress = async () => {
        const ctx = getAudioContext()
        await ctx.resume()
        if (voiceRef.current){
            return
        }
        voiceRef.current = noteOn(ctx, patch, 220)
    }

    const handleRelease = () => {
        const ctx = getAudioContext()

        if (!voiceRef.current){
            return
        }
        noteOff(ctx, voiceRef.current, patch)
        voiceRef.current = null
    }

    const handleCutoff = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const filterCut = positionToCutoff(e.target.valueAsNumber)
        const next = {...patch, filterCutoff: filterCut}
        setPatch(next)
        if (voiceRef.current){
            updateVoice(getAudioContext(), voiceRef.current, next)
        }
    }

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
    <input type="range" min={0} max={1} step={0.001} value={cutoffToPosition(patch.filterCutoff)} onChange={handleCutoff} />
    {Math.round(patch.filterCutoff)} Hz 
</>)}