import { DEFAULT_PATCH, type Patch} from "@synthu/shared";
import { useRef, useState } from "react";
import { noteOff, noteOn, type Voice } from "./audio/voice";
import { getAudioContext } from "./audio/context";

export default function Freeplay(){
    const [patch, setPatch] = useState<Patch>(DEFAULT_PATCH)
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

    return <button onPointerDown={handlePress} onPointerUp={handleRelease} onPointerLeave={handleRelease}>Hold to play clown</button>
}