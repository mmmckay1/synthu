import type { Lesson } from "../lesson.js";
import { DEFAULT_PATCH } from "../patch.js";

export const CHAPTER_1 = {
    number: 1,
    title: "Waveforms",
    introText: "There are four basic waveforms: sine, square, sawtooth, and triangle. While there are numerous others, and some synths even let you create your own, these provide the foundation for the majority of sounds you will hear from any synth. "
} as const

export const CHAPTER_1_LESSONS: (Lesson & {number: number})[] = [{
    number: 1,
        title: "Sine wave",
        introText: "This is a sample intro text.  FIll THIS IN LATER",
        targetPatch: {...DEFAULT_PATCH, osc1Waveform: "sine"},
        unlockedParameters: ["osc1Waveform"],
        explanation: "this is the explanation",
        startPatch: { osc1Waveform: "square"}
    }  , 
        {
    number: 2,
        title: "Square wave",
        introText: "This is a sample intro text.  FIll THIS IN LATER",
        targetPatch: {...DEFAULT_PATCH, osc1Waveform: "square"},
        unlockedParameters: ["osc1Waveform"],
        explanation: "this is the explanation"},
        {
    number: 3,
        title: "Sawtooth wave",
        introText: "This is a sample intro text.  FIll THIS IN LATER",
        targetPatch: {...DEFAULT_PATCH, osc1Waveform: "sawtooth"},
        unlockedParameters: ["osc1Waveform"],
        explanation: "this is the explanation"},
        {
    number: 4,
        title: "Triangle wave",
        introText: "This is a sample intro text.  FIll THIS IN LATER",
        targetPatch: {...DEFAULT_PATCH, osc1Waveform: "triangle"},
        unlockedParameters: ["osc1Waveform"],
        explanation: "this is the explanation"},
]
