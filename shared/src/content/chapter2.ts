import type { Lesson } from "../lesson.js";
import { DEFAULT_PATCH } from "../patch.js";

export const CHAPTER_2 = {
    number: 2,
    title: "Filters",
    introText: "The next tool used in a synth to shape its sound is a filter. As its name describes, the filter 'filters' out frequencies in the waveform depending on where the cutoff is set."
} as const

export const CHAPTER_2_LESSONS: (Lesson & { number: number })[] = [
    {
        number: 1,
        title: "Lowpass Filter",
        introText: "The lowpass filter only allows frequencies below the cutoff value to pass through to the output. Listen to the target patch and try to match the cutoff value.",
        targetPatch: { ...DEFAULT_PATCH, osc1Waveform: "sawtooth", filterCutoff: 811, filterType: "lowpass" },
        unlockedParameters: ["filterCutoff"],
        explanation: "Using a lowpass with cutoff around 810 Hz takes off the harsher, buzzier tones on the sawtooth wave, leaving a nice, present, rounded note.",
    },
    {
        number: 2,
        title: "Highpass Filter",
        introText: "The highpass filter only passes the frequencies higher than the cutoff value.  Listen to the target patch and try to match the cutoff value.",
        targetPatch: { ...DEFAULT_PATCH, osc1Waveform: "sawtooth", filterCutoff: 2000, filterType: "highpass" },
        unlockedParameters: ["filterCutoff"],
        explanation: "A highpass around 2000 Hz takes all of the core out of the sawtooth, leaving the tinny high-end frequencies to come through.",
        startPatch: { filterCutoff: 20 }
    },
    {
        number: 3,
        title: "Bandpass Filter",
        introText: "The bandpass filter only passes through frequencies within a certain range, while the frequencies both above and below are cut.  The center point of the range is set by the filter cutoff, and the width of the band is set by filter resonance.",
        targetPatch: { ...DEFAULT_PATCH, osc1Waveform: "sawtooth", filterCutoff: 1200, filterType: "bandpass", filterResonance: 0.5 },
        unlockedParameters: ["filterCutoff"],
        explanation: "With the resonance preset to 50%, the band cuts out most of the highs and lows. The output is a meager beep sound, centered on 1200 Hz.",
        startPatch: { filterCutoff: 200 }
    },
    {
        number: 4,
        title: "Filter Resonance",
        introText: "The filter resonance boosts the frequencies near the cutoff value. This adds an audible brightness to the peak at the cutoff value.",
        targetPatch: { ...DEFAULT_PATCH, osc1Waveform: "sawtooth", filterResonance: 0.8, filterCutoff: 3500, filterType: "lowpass" },
        unlockedParameters: ["filterResonance"],
        explanation: "With the lowpass filter and a cutoff set to 3500 Hz, adding a healthy bit of resonance (80%) brings out a very vibrant, almost nasal tone."
    }
]