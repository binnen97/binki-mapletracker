import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import Characters from './pages/Characters'
import Cubing from './pages/Cubing'
import Overview from './pages/Overview'
import Starforce from './pages/Starforce'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <NavLink to="/">Characters</NavLink>
        <NavLink to="/cubing">Cubing</NavLink>
        <NavLink to="/overview">Overview</NavLink>
        <NavLink to="/starforce">Starforce</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Characters />} />
        <Route path="/cubing" element={<Cubing />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/starforce" element={<Starforce />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App