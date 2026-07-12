import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LostItemPage from "./pages/LostItemPage";
import FoundItemPage from "./pages/FoundItemPage";
import MatchesPage from "./pages/MatchesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lost-item" element={<LostItemPage />} />
        <Route path="/found-item" element={<FoundItemPage />} />
        <Route path="/matches" element={<MatchesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;