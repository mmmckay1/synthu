import { DEFAULT_PATCH, type Patch} from "@synthu/shared";
import { useRef, useState, useEffect, useCallback } from "react";
import { noteOff, noteOn, updateVoice, type Voice } from "./audio/voice";
import { getAudioContext, getMasterGain, getSynthBus } from "./audio/context";
import { SynthPanel } from "./SynthPanel";
import Knob from "./Knob";
import Oscilloscope from "./Oscilloscope";

export default function Freeplay(){
    const [patch, setPatch] = useState<Patch>( {...DEFAULT_PATCH, osc1Waveform: "sawtooth", filterType: "lowpass"})
    const [volume, setVolume] = useState(0.5)
    const voiceRef = useRef<Voice | null>(null)
    const [playing, setPlaying] = useState(false)

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
        voiceRef.current = noteOn(ctx, patch, 220, getSynthBus())
        setPlaying(true)
    }, [patch])

    const handleRelease = useCallback(() => {
        const ctx = getAudioContext()

        if (!voiceRef.current){
            return
        }
        noteOff(ctx, voiceRef.current, patch)
        voiceRef.current = null
        setPlaying(false)
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
    <div className="page">
    <div className="synth-body">
    <div className="panel">
        <div className="section master">
            <h2>Volume</h2>
            <div className="row">
                <button onPointerDown={handlePress} onPointerUp={handleRelease} onPointerLeave={handleRelease}>Hold to play clown</button>
                <Knob label="Volume" position={volume} display={`${Math.round(volume*100)} %`} onChange={(p) => {setVolume(p); getMasterGain().gain.setTargetAtTime(p**3, getAudioContext().currentTime, 0.01)}}/>
            </div>
        </div> 
        <SynthPanel patch={patch} onChange={setParameter} />
    </div>
    <div className="side">
    <div className="section scope">
    <Oscilloscope active={playing}/>
    </div>
    <div className="section nameplate">
        <h2>Synth<br/>Dude</h2>
        <p className="moe">by BigMoe</p>
    </div>
    </div>
    </div>

{/* to lock, add unlocked={["thing_to_unlocked", etc]} */}

</div>

</>)}