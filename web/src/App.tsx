import { SAMPLE_LESSON } from '@synthu/shared'
import Freeplay from './Freeplay.tsx'
import { Lesson } from './Lesson.tsx'
import { useState } from 'react'

function App() {
  const [page, setPage] = useState<"freeplay" | "lesson">("freeplay")


  return (
    <>
    <button onClick={() => setPage("freeplay")}>Freeplay Synth</button>
    <button onClick={() => setPage("lesson")}>Lessons</button>
      {/* <p>You can do it tootall! -Mama, Froggie, Binky, Minky</p> */}
      {page === "freeplay" ? <Freeplay /> : <Lesson lesson={SAMPLE_LESSON} />}
    </>
  )
}
export default App