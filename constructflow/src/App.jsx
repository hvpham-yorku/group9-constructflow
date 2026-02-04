import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ManagerDashboard from "./pages/ManagerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import BlueprintViewer from "./pages/BlueprintViewer";
import ProjectsPage from "./pages/ProjectsPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/blueprint" element={<BlueprintViewer />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
