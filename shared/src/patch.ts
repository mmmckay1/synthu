import {z} from "zod"

export const WaveformSchema = z.enum(["sine","square","triangle","sawtooth"])
export const FilterTypeSchema = z.enum(["lowpass","highpass","bandpass","none"])

export const PatchSchema = z.strictObject({
    osc1Waveform: WaveformSchema,
    osc2Waveform: WaveformSchema,
    osc1Mix: z.number().min(0).max(1),
    osc2Mix: z.number().min(0).max(1),
    osc2Detune: z.number().min(-100).max(100),
    osc1Octave: z.int().min(-2).max(2),
    osc2Octave: z.int().min(-2).max(2),
    ampAttack: z.number().min(1).max(5000),
    ampDecay: z.number().min(1).max(5000),
    ampSustain: z.number().min(0).max(1),
    ampRelease: z.number().min(1).max(5000),
    filterType: FilterTypeSchema,
    filterCutoff: z.number().min(20).max(20000),
    filterResonance: z.number().min(0).max(1)
})

export type Patch = z.infer<typeof PatchSchema>;
export type Waveform = z.infer<typeof WaveformSchema>;
export type FilterType = z.infer<typeof FilterTypeSchema>;