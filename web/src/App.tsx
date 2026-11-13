import { DEFAULT_PATCH, type Patch } from '@synthu/shared'
import { getAudioContext } from './audio/context.ts'
import { noteOff, noteOn, updateVoice } from './audio/voice.ts'

function App() {

  const practiceBeep = async() =>{
    const ctx = getAudioContext()
    await ctx.resume()
 
    const testPatch: Patch = {
      ...DEFAULT_PATCH, osc2Mix: 0.5, osc2Waveform: "sawtooth", 
      osc1Octave: -1, osc1Waveform: "sawtooth", filterCutoff: 1300, filterType: 'lowpass',
      filterResonance: 1
    }

    const nextPatch: Patch ={
      ...DEFAULT_PATCH, osc2Mix: 0.2, osc2Waveform: "sawtooth", osc2Detune: 20, osc1Mix: 0.5,
      osc2Octave: -2, osc1Octave: -1, osc1Waveform: "sawtooth", filterCutoff: 1000, filterType: 'lowpass',
      filterResonance: 1
    }
    const voice = noteOn(ctx, testPatch, 600)
    setTimeout(() => {updateVoice(ctx, voice, nextPatch)}, 500)
    setTimeout(() => { noteOff(ctx, voice, nextPatch)}, 1000)
  }

  return (
    <>
      <p>You can do it buddy! -Mama, Froggie, Binky, Minky</p>
      <button onClick={practiceBeep}>test beep</button>

    </>
  )
}



export default App
