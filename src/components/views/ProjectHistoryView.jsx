import React, { useContext, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';

const ProjectHistoryView = () => {
  const { projects, activeHistoryProjectId, setActiveHistoryProjectId, setCurrentView, setActiveProjectId } = useContext(ProjectContext);

  useEffect(() => {
    if (!activeHistoryProjectId) setCurrentView('overview');
  }, [activeHistoryProjectId, setCurrentView]);

  if (!activeHistoryProjectId) return null;

  const project = projects.find(p => p.id === activeHistoryProjectId);
  if (!project) return null;


  const logs = [...(project.activityLog || [])].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatLogDate = (dateStr) => {
    const d = new Date(dateStr);
   
    if (isNaN(d.getTime())) return dateStr; 
  
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const handleGoToBoard = () => {
    setActiveProjectId(project.id);
    setCurrentView('dashboard');
  };

  const handleBack = () => {
    setActiveHistoryProjectId(null);
    setCurrentView('overview');
  };

  return (
    <div className="view-container active">
      <button onClick={handleBack} style={{ 
        marginBottom: '20px', background: 'transparent', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' 
      }}>
        ← Back to Operations
      </button>

      <h1 className="hero-title">{project.name}</h1>
      <p className="hero-sub">Activity timeline and audit log.</p>

      <div style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', marginTop: '20px', maxWidth: '800px' }}>
        {logs.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-sub)' }}>No recent activity to show.</p>
        ) : (
          <div className="operations-timeline">
            {logs.map((log, index) => (
              <div key={log.id} style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '24px', position: 'relative', paddingBottom: index === logs.length - 1 ? '0' : '32px' }}>
                <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--card-bg)' }}></div>
                <p style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '500', lineHeight: '1.4', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {log.text || (log.user ? `${log.action} by ${log.user}` : log.action)}
                </p>
                <span style={{ fontSize: '13px', color: 'var(--text-sub)', background: 'var(--bg-main)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  {formatLogDate(log.date)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-start' }}>
          <button onClick={handleGoToBoard} style={{ padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
            Open Kanban Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHistoryView;