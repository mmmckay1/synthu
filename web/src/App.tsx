import { DEFAULT_PATCH } from '@synthu/shared'
import { getAudioContext } from './audio/context.ts'

function App() {

  const practiceBeep = async() =>{
    const ctx = getAudioContext()
    await ctx.resume()
    const buttonOsc = ctx.createOscillator()
    buttonOsc.frequency.value = 400
    buttonOsc.connect(ctx.destination)
    buttonOsc.start()
    buttonOsc.stop(ctx.currentTime + 0.5)
  }
  return (
    <>
      <p>{DEFAULT_PATCH.osc1Waveform}</p>
      <button onClick={practiceBeep}>test beep</button>

    </>
  )
}



export default App
