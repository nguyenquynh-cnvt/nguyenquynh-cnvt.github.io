import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import IncidentsPage from './pages/IncidentsPage';
import TreatmentPage from './pages/TreatmentPage';
import PostTreatmentPage from './pages/PostTreatmentPage';
import DataCheckPage from './pages/DataCheckPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';

function AppShell() {
  const { currentUser, activePage } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!currentUser) return <LoginPage />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'subjects': return <SubjectsPage />;
      case 'incidents': return <IncidentsPage />;
      case 'treatment': return <TreatmentPage />;
      case 'post-treatment': return <PostTreatmentPage />;
      case 'data-check': return <DataCheckPage />;
      case 'alerts': return <AlertsPage />;
      case 'reports': return <ReportsPage />;
      case 'admin': return <AdminPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <Header
        collapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
      />
      <main
        className={`transition-all duration-300 pt-14 ${sidebarCollapsed ? 'pl-16' : 'pl-64'}`}
      >
        <div className="p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
