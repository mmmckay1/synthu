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
        introText: "Press the button to listen to the target patch and adjust the waveform of oscillator 1 to match the sound.",
        targetPatch: {...DEFAULT_PATCH, osc1Waveform: "sine"},
        unlockedParameters: ["osc1Waveform"],
        explanation: "The sine wave is the most basic waveform. It contains only the fundamental frequency, with no harmonics or overtones.",
        startPatch: { osc1Waveform: "square"}
    }  , 
        {
    number: 2,
        title: "Square wave",
        introText: "Press the button to listen to the target patch and adjust the waveform of oscillator 1 to match the sound.",
        targetPatch: {...DEFAULT_PATCH, osc1Waveform: "square"},
        unlockedParameters: ["osc1Waveform"],
        explanation: "A square wave has more buzz in it than the sine wave.  This is due to the harmonics on the odd-number multiples of the frequency."},
        {
    number: 4,
        title: "Sawtooth wave",
        introText: "Press the button to listen to the target patch and adjust the waveform of oscillator 1 to match the sound.",
        targetPatch: {...DEFAULT_PATCH, osc1Waveform: "sawtooth"},
        unlockedParameters: ["osc1Waveform"],
        explanation: "The sawtooth wave has the most character, as it contains both even and odd harmonics.  This results in a very bright, rich sound."},
        {
    number: 3,
        title: "Triangle wave",
        introText: "Press the button to listen to the target patch and adjust the waveform of oscillator 1 to match the sound.",
        targetPatch: {...DEFAULT_PATCH, osc1Waveform: "triangle"},
        unlockedParameters: ["osc1Waveform"],
        explanation: "The triangle wave also has odd-frequency harmonics similar to the square wave, yet the transition between the peaks is smoother.  This results in a sound that has more buzz than a sine wave, but smoother than a square wave."},
]
