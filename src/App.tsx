import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import CompanyEvaluation from "./CompanyEvaluation.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/company-evaluation" element={<CompanyEvaluation />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
