import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import ProjectPage from './pages/ProjectPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export default function App() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />
      <Route
        path="/projects"
        element={
          <Protected>
            <ProjectsPage />
          </Protected>
        }
      />
      <Route
        path="/tasks"
        element={
          <Protected>
            <TasksPage />
          </Protected>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <Protected>
            <ProjectPage />
          </Protected>
        }
      />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
}
