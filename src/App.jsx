import React, { useState, useContext } from 'react';
import { ProjectProvider, ProjectContext } from './context/ProjectContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Timer from './components/layout/Timer';
import HomeView from './components/views/HomeView';
import OverviewView from './components/views/OverviewView';
import DashboardView from './components/views/DashboardViewt';
import CalendarView from './components/views/CalendarView';
import ProjectHistoryView from './components/views/ProjectHistoryView'; // IMPORT NEW VIEW

const AppContent = () => {
  const { currentView, notification } = useContext(ProjectContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-body">
        <Sidebar isOpen={sidebarOpen} />
        <main className="content-main">
          {currentView === 'home' && <HomeView />}
          {currentView === 'overview' && <OverviewView />}
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'project-history' && <ProjectHistoryView />} {/* RENDER NEW VIEW */}
        </main>
        <Timer />
      </div>

      <div className="toast-container">
        {notification && (
          <div className="notification">
            <span dangerouslySetInnerHTML={{ __html: notification }}></span>
          </div>
        )}
      </div>
    </>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}