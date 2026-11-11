import { DEFAULT_PATCH } from '@synthu/shared'
import { getAudioContext } from './audio/context.ts'

function App() {

  const practiceBeep = async() =>{
    const ctx = getAudioContext()
    await ctx.resume()
    const buttonOsc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const now = ctx.currentTime
    buttonOsc.connect(gainNode)
    buttonOsc.frequency.value = 400
    gainNode.connect(ctx.destination)
    buttonOsc.start(now)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(1, now + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, now + 0.5)
    
    buttonOsc.stop(now + 0.5)
  }
  return (
    <>
      <p>{DEFAULT_PATCH.osc1Waveform}</p>
      <button onClick={practiceBeep}>test beep</button>

    </>
  )
}



export default App
