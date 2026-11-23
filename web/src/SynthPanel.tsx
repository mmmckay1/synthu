import Knob from "./Knob"
import { FilterTypeSchema, WaveformSchema, type Patch} from "@synthu/shared"
import { linearToPosition, logToPosition, positionToLinear, positionToLog } from "./audio/scale"


type Props = {
    patch: Patch
    onChange: <K extends keyof Patch>(key: K, value: Patch[K])=> void
    unlocked?: (keyof Patch)[]
}

export function SynthPanel({ patch, onChange, unlocked }: Props){
    const isLocked = (key: keyof Patch) => unlocked !== undefined && !unlocked.includes(key)
    const isHighlighted = (key: keyof Patch) => unlocked !== undefined && unlocked.includes(key)
    return (
        <>
        <div className="section filter">
            <h2>Filter</h2>
            <div className="row">
                <select disabled={isLocked('filterType')} style={{ outline: isHighlighted('filterType') ? "3px solid #e8a33d" : undefined }} value={patch.filterType} onChange={(e) => onChange('filterType', FilterTypeSchema.parse(e.target.value))}>
        {FilterTypeSchema.options.map((w) => (
            <option key={w} value={w}>{w}</option>))}
                </select>
                <Knob label="Cutoff" locked={isLocked('filterCutoff')} highlight={isHighlighted('filterCutoff')}position={logToPosition(patch.filterCutoff, 20, 20000)} display={ `${Math.round(patch.filterCutoff)} Hz`} onChange={(p) => onChange('filterCutoff', positionToLog(p, 20, 20000))}/>
                <Knob label="Resonance" locked={isLocked('filterResonance')} highlight={isHighlighted('filterResonance')}position={patch.filterResonance} display={`${Math.round(patch.filterResonance*100)} %`} onChange={(p) => onChange('filterResonance', p)}/>
            </div>
        </div>
        <div className="section osc1">
            <h2>Osc 1</h2>
            <div className="row">
                <select disabled={isLocked('osc1Waveform')} style={{ outline: isHighlighted('osc1Waveform') ? "3px solid #e8a33d" : undefined }}value={patch.osc1Waveform} onChange={(e) => onChange('osc1Waveform', WaveformSchema.parse(e.target.value))}>
                    {WaveformSchema.options.map((w) => (
                    <option key={w} value={w}>{w}</option>))}
                </select>
                <Knob label="Level" locked={isLocked('osc1Mix')} highlight={isHighlighted('osc1Mix')}position={patch.osc1Mix} display={ `${Math.round(patch.osc1Mix*100)} %`} onChange={(p) => onChange('osc1Mix', p)}/>
                <Knob label="Octave" locked={isLocked('osc1Octave')} highlight={isHighlighted('osc1Octave')}position={linearToPosition(patch.osc1Octave, -2, 2)} display={`${patch.osc1Octave}`} onChange={(p) => onChange('osc1Octave', Math.round(positionToLinear(p, -2, 2)))}/>
            </div>
        </div>
        <div className="section osc2">
            <h2>Osc 2</h2>
            <div className="row">
                <select disabled={isLocked('osc2Waveform')} style={{ outline: isHighlighted('osc2Waveform') ? "3px solid #e8a33d" : undefined }} value={patch.osc2Waveform} onChange={(e) => onChange('osc2Waveform', WaveformSchema.parse(e.target.value))}>
                    {WaveformSchema.options.map((w) => (
                    <option key={w} value={w}>{w}</option>))}
                </select>
                <Knob label="Level" locked={isLocked('osc2Mix')} highlight={isHighlighted('osc2Mix') }position={patch.osc2Mix} display={ `${Math.round(patch.osc2Mix*100)} %`} onChange={(p) => onChange('osc2Mix', p)}/>
                <Knob label="Octave" locked={isLocked('osc2Octave')} highlight={isHighlighted('osc2Octave')} position={linearToPosition(patch.osc2Octave, -2, 2)} display={`${patch.osc2Octave}`} onChange={(p) => onChange('osc2Octave', Math.round(positionToLinear(p, -2, 2)))}/>
                <Knob label="Detune" locked={isLocked('osc2Detune')} highlight={isHighlighted('osc2Detune')} position={linearToPosition(patch.osc2Detune, -100, 100)} display={ `${Math.round(patch.osc2Detune)} cents`} onChange={(p) => onChange('osc2Detune', positionToLinear(p, -100, 100))}/>
            </div>
        </div>
        <div className="section amp">
            <h2>Amp</h2>
            <div className="row">
                <Knob label="Attack" locked={isLocked('ampAttack')} highlight={isHighlighted('ampAttack')}position={logToPosition(patch.ampAttack, 1, 5000)} display={ `${Math.round(patch.ampAttack)} ms`} onChange={(p) => onChange('ampAttack', positionToLog(p, 1, 5000))} />
                <Knob label="Decay" locked={isLocked('ampDecay')} highlight={isHighlighted('ampDecay')}position={logToPosition(patch.ampDecay, 1, 5000)} display={ `${Math.round(patch.ampDecay)} ms`} onChange={(p) => onChange('ampDecay', positionToLog(p, 1, 5000))}/>
                <Knob label="Sustain" locked={isLocked('ampSustain')} highlight={isHighlighted('ampSustain')} position={patch.ampSustain} display={ `${Math.round(patch.ampSustain*100)} %`} onChange={(p) => onChange('ampSustain', p)}/>
                <Knob label="Release" locked={isLocked('ampRelease')} highlight={isHighlighted('ampRelease')} position={logToPosition(patch.ampRelease, 1, 5000)} display={ `${Math.round(patch.ampRelease)} ms`} onChange={(p) => onChange('ampRelease', positionToLog(p, 1, 5000))}/>
            </div>
        </div>
        </>
    )
}


