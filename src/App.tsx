import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import CompanyEvaluation from "./CompanyEvaluation.tsx";
import CreditRatingCalculator from "./CreditRating.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Home />} />
          <Route path="/company-evaluation" element={<CompanyEvaluation />} />
          <Route path="/Credit-Rating-Calculator" element={<CreditRatingCalculator/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
