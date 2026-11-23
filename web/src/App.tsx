import Freeplay from './Freeplay.tsx'
import { Routes, Route } from 'react-router'
import { Header } from './Header.tsx'
import { About } from './About.tsx'
import { Learn } from './Learn.tsx'

function App() {

  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element= {<Freeplay/>} />
        <Route path="/courses" element={<Learn />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses/:lessonId" element={<Learn />}/>
      </Routes>
    </>
  )
}
export default App