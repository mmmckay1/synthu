import { SAMPLE_LESSON } from '@synthu/shared'
// import Freeplay from './Freeplay.tsx'
import { Lesson } from './Lesson.tsx'

function App() {

  return (
    <>
      {/* <p>You can do it tootall! -Mama, Froggie, Binky, Minky</p> */}
      {/* <Freeplay /> */}
      <Lesson lesson={SAMPLE_LESSON} />
    </>
  )
}
export default App