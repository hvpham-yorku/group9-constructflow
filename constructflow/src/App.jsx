// Main app component - sets up routing and authentication context
// All pages are protected by the authentication provider
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ManagerDashboard from "./pages/ManagerDashboard";
import BlueprintViewer from "./pages/BlueprintViewer";
import ProjectsPage from "./pages/ProjectsPage";
import WorkersPage from "./pages/WorkersPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

// Root app component with routing
function App() {
  // Wrap entire app with auth context and router
  // Uses role-based routing to show different dashboards for managers vs workers
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/"                  element={<Navigate to="/dashboard" replace />} />
          {/* Both admin and workers land on /dashboard */}
          <Route path="/dashboard"         element={<ManagerDashboard />} />
          <Route path="/blueprint"         element={<BlueprintViewer />} />
          <Route path="/projects"          element={<ProjectsPage />} />
          <Route path="/workers"           element={<WorkersPage />} />
          <Route path="/reports"           element={<ReportsPage />} />
          <Route path="/settings"          element={<SettingsPage />} />
          {/* Legacy worker route redirect */}
          <Route path="/worker/dashboard"  element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
