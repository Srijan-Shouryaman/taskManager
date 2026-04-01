import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';

const Sidebar = ({ isOpen }) => {
  const { projects, setCurrentView, setActiveProjectId } = useContext(ProjectContext);

  const handleProjectClick = (id) => {
    setActiveProjectId(id);
    setCurrentView('dashboard');
  };

  return (
    <aside className={`sidebar ${!isOpen ? 'sidebar-hidden' : ''}`}>
      <nav>
        <div className="nav-item" onClick={() => setCurrentView('overview')} style={{cursor: 'pointer'}}>
          &middot; Overview
        </div>
        <div className="nav-item" onClick={() => setCurrentView('calendar')}>
          &middot; Calendar
        </div>
        <div className="nav-group-label">Active Projects</div>
        <div className="nav-list">
          {projects.map(project => (
            <div key={project.id} className="sub-nav-item" onClick={() => handleProjectClick(project.id)}>
              &middot; {project.name}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;