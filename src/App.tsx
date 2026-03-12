import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home.tsx';
import Login from './Login.tsx';

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
