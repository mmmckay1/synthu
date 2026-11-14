import { useRef } from "react"

export type KnobProps = {
    label: string
    position: number //0-1
    display: string
    onChange: (position: number) => void
}

export default function Knob ({ label, position, display, onChange}: KnobProps){
        const dragRef = useRef<{ y: number, position: number } | null>(null)
        const angle = -135+position*270
        const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            dragRef.current = { y: e.clientY, position: position}

        }
        const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) =>{
            const start = dragRef.current
            if (!start){
                return
            }
            const dy = start.y - e.clientY
            const next = start.position + dy / 200
            const cl = Math.min(1, Math.max(0, next))
            onChange(cl)
        }
        const handlePointerUp = () =>{
            dragRef.current = null
        }
        return(
            <div>
                <svg width={56} height={56} viewBox="0 0 100 100" onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} onPointerDown={handlePointerDown} style={{ touchAction: "none", cursor: "ns-resize"}}>
                    <circle cx={50} cy={50} r={40} fill="#E3DAC9"/>
                    <line x1={50} y1={50} x2={50} y2={14} stroke="#9b3b38" strokeWidth={6} strokeLinecap="round" transform={`rotate(${angle} 50 50)`}/>
                </svg>
                <div>{label}</div>
                <div>{display}</div>
            </div>
        )
}

