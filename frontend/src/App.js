import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";

import LandingPage        from "./pages/LandingPage";
import LoginPage          from "./pages/LoginPage";
import RegisterPage       from "./pages/RegisterPage";
import DashboardPage      from "./pages/DashboardPage";
import AdminDashboard     from "./pages/AdminDashboard";
import LostItemPage       from "./pages/LostItemPage";
import FoundItemPage      from "./pages/FoundItemPage";
import MatchesPage        from "./pages/MatchesPage";
import NotificationsPage  from "./pages/NotificationsPage";
import AIAgentsPage       from "./pages/AIAgentsPage";
import ClaimsPage         from "./pages/ClaimsPage";
import ProfilePage        from "./pages/ProfilePage";
import SearchPage         from "./pages/SearchPage";

// Guard: redirects to login if not authenticated
function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student + Admin */}
          <Route path="/dashboard"    element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/lost-items"   element={<PrivateRoute><LostItemPage /></PrivateRoute>} />
          <Route path="/found-items"  element={<PrivateRoute><FoundItemPage /></PrivateRoute>} />
          <Route path="/matches"      element={<PrivateRoute><MatchesPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/ai-agents"    element={<PrivateRoute><AIAgentsPage /></PrivateRoute>} />
          <Route path="/claims"       element={<PrivateRoute><ClaimsPage /></PrivateRoute>} />
          <Route path="/profile"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/search"       element={<PrivateRoute><SearchPage /></PrivateRoute>} />

          {/* Admin only */}
          <Route path="/admin"        element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users"  element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/claims" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />

          {/* Legacy redirects */}
          <Route path="/lost-item"  element={<Navigate to="/lost-items"  replace />} />
          <Route path="/found-item" element={<Navigate to="/found-items" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
