import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import CreditRatingCalculator from "./CreditRating.tsx";
import PhysicalCreation from "./PhysicalCreation.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Home />} />
          <Route path="/Credit-Rating-Calculator" element={<CreditRatingCalculator/>}/>
          <Route path="/create-physical" element={<PhysicalCreation />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
