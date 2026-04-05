import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';

const OverviewView = () => {
  const { projects, setActiveProjectId, setActiveHistoryProjectId, setCurrentView } = useContext(ProjectContext);

  const getProjectProgress = (project) => {
    const totalTasks = project.planning.length + project.progress.length + project.done.length;
    if (totalTasks === 0) return 0;
    return Math.round((project.done.length / totalTasks) * 100);
  };

  const getUrgentTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let urgent = [];

    projects.forEach(p => {
      if (!p.deadline) return;
      const dueDate = new Date(p.deadline);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays <= 3 && diffDays >= 0) {
        const pendingTasks = [...p.planning, ...p.progress].map(t => ({
          ...t, projectName: p.name, projectId: p.id, dueIn: diffDays
        }));
        urgent = [...urgent, ...pendingTasks];
      }
    });
    return urgent;
  };

  const urgentTasks = getUrgentTasks();

  const handleGoToHistoryPage = (projectId) => {
    setActiveHistoryProjectId(projectId);
    setCurrentView('project-history'); 
  };

  const handleGoToBoard = (projectId) => {
    setActiveProjectId(projectId);
    setCurrentView('dashboard');
  };

  return (
    <div className="view-container active">
      <h1 className="hero-title">📊 Operations Overview</h1>
      <p className="hero-sub">High-level progress and urgent action items.</p>

      <div className="board operations-overview" style={{ paddingBottom: '0' }}>
        <div className="column" style={{ flex: 1.5 }}>
          <div className="column-header">Active Projects</div>
          
          {projects.map(p => {
            const progress = getProjectProgress(p);
            return (
              <div key={p.id} className="task-card" onClick={() => handleGoToHistoryPage(p.id)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>{p.name}</h4>
                  <span style={{ fontWeight: 'bold', color: progress === 100 ? 'var(--accent-green)' : 'var(--accent)' }}>{progress}%</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-fill" style={{ width: `${progress}%`, background: progress === 100 ? 'var(--accent-green)' : 'var(--accent)' }}></div>
                </div>
                <p style={{ marginTop: '12px' }}>Deadline: {p.deadline || 'No deadline'}</p>
              </div>
            );
          })}
        </div>

        <div className="column" style={{ flex: 1 }}>
          <div className="column-header" style={{ color: 'var(--accent-red)' }}>⚠️ Urgent Tasks</div>
          
          {urgentTasks.length === 0 ? (
            <p style={{ padding: '15px', color: 'var(--text-sub)' }}>You are all caught up!</p>
          ) : (
            urgentTasks.map(task => (
              <div key={task.id} className="task-card" style={{ borderLeft: '4px solid var(--accent-red)' }} onClick={() => handleGoToBoard(task.projectId)}>
                <h4>{task.title}</h4>
                <p>From: {task.projectName}</p>
                <div className="cal-project-badge" style={{ width: 'fit-content', marginTop: '10px' }}>Due in {task.dueIn} day(s)</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewView;