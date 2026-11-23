import { useEffect, useRef } from "react";
import { getAnalyser } from "./audio/context";

const WIDTH = 400
const HEIGHT = 160
const DISPLAY_GAIN = 0.5
const COUNT = 1024
const SILENCE = 0.001

function peakOf(data: Float32Array): number{
        let max = 0
        for (let i = 0; i < data.length; i++){
            if (Math.abs(data[i])>max) max = Math.abs(data[i])
        }
        return max
    }



export default function Oscilloscope( { active }: { active: boolean }){
    const canvasRef = useRef<HTMLCanvasElement>(null)



    useEffect(() => {
        const canvas = canvasRef.current
        if(canvas===null) return
        const dpr = window.devicePixelRatio || 1
        canvas.width = WIDTH * dpr
        canvas.height = HEIGHT * dpr
        const g = canvas.getContext("2d")
        if(g===null) return
        g.scale(dpr, dpr)
        const analyser = getAnalyser()
        const data = new Float32Array(analyser.fftSize)
        let frameId = 0
        let silentFrames = 0
        const draw = () => {
            analyser.getFloatTimeDomainData(data)
            const peak = peakOf(data)
            const start = findTrigger(data, COUNT, peak*0.2)
            drawGrid(g)
            drawTrace(g, data, start)
            if(!active && peak < SILENCE) {
                silentFrames++
            }
            else {
                silentFrames = 0
            }
            if(silentFrames>10) return
            frameId = requestAnimationFrame(draw)
        }
        frameId = requestAnimationFrame(draw)
        return () => cancelAnimationFrame(frameId)
    }, [active])
            return(
            <canvas ref={canvasRef} style={{ width: WIDTH, height: HEIGHT, borderRadius: 6}} />
        )
}

function drawGrid(g: CanvasRenderingContext2D){
        g.fillStyle = "#0a140d"
        g.fillRect(0, 0, WIDTH, HEIGHT)
        g.strokeStyle = "rgba(255, 246, 229, 0.15)"
        g.lineWidth = 1
        for (let i = 1; i < 10; i++){
            const x = Math.round((WIDTH/10)* i) + 0.5
            g.beginPath()
            g.moveTo(x, 0)
            g.lineTo(x, HEIGHT)
            g.stroke()
        }
        for ( let i = 1; i < 4; i++){
            const y = Math.round((HEIGHT/4) * i) + 0.5
            g.beginPath()
            g.moveTo(0, y)
            g.lineTo(WIDTH, y)
            g.stroke()
        }
}

function drawTrace(g: CanvasRenderingContext2D, data: Float32Array, start: number){
    g.strokeStyle = "#FED348"
    g.lineWidth = 2
    g.beginPath()
    for (let i = 0; i < COUNT; i++){
        const x = (i / (COUNT -1)) * WIDTH
        const y = HEIGHT / 2 - data[start + i] * DISPLAY_GAIN * (HEIGHT/2)
        if(i===0) g.moveTo(x, y)
        else g.lineTo(x, y)
    }
    g.stroke()
}

function findTrigger(data: Float32Array, count: number, threshold: number){
    let armed = false
    for (let i =1; i < data.length - count; i++){
        if (data[i] < -threshold) {
            armed = true
        }
        else if (armed && data[i-1] < 0 && data[i] >=0) return i
    }
    return 0
}