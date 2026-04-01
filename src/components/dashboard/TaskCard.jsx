import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import CompleteSubtaskModal from '../modals/CompleteSubtaskModal'; 

const TaskCard = ({ task, colId }) => {
  const { activeProject, toggleSubtask, addSubtask, completeSubtask } = useContext(ProjectContext);
  const [expanded, setExpanded] = useState(false);
  const [activeModalSubtask, setActiveModalSubtask] = useState(null); 

  const progress = task.subtasks?.length === 0 ? 0 : 
    Math.round((task.subtasks.filter(st => st.isCompleted).length / task.subtasks.length) * 100);
  
  const isDone = progress === 100 || colId === 'done';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      addSubtask(activeProject.id, task.id, e.target.value.trim());
      e.target.value = ''; 
    }
  };

  return (
    <>
      <div className={`task-card ${isDone ? 'is-done' : ''} ${expanded ? 'expanded' : ''}`} draggable 
           onDragStart={(e) => { e.dataTransfer.setData("taskId", task.id); setTimeout(() => e.target.style.opacity = '0.5', 0); }}
           onDragEnd={(e) => e.target.style.opacity = '1'}
           onClick={(e) => { if(e.target.tagName !== 'INPUT') setExpanded(!expanded) }}>
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <div className="progress-wrap">
          <div className="progress-fill" style={{width: `${progress}%`}}></div>
        </div>
        
        {expanded && (
          <div className="subtask-section" style={{display: 'block'}}>
            {task.subtasks.map((st, i) => (
              <div className="subtask-item" key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
                <div className="subtask-text-container" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="subtask-bullet">•</span> 
                    <span style={{ fontSize: '14px', lineHeight: '1.2', textDecoration: st.isCompleted ? 'line-through' : 'none', color: st.isCompleted ? 'var(--text-sub)' : 'inherit' }}>
                      {st.text}
                    </span>
                  </div>
                  {st.isCompleted && st.completedBy && (
                    <span style={{ fontSize: '12px', color: 'var(--text-sub)', marginLeft: '14px' }}>
                      - done by <strong style={{color: 'var(--text-main)'}}>{st.completedBy}</strong> on {st.completedDate}
                    </span>
                  )}
                </div>

                <input 
                  type="checkbox" checked={st.isCompleted} disabled={colId !== 'progress' && !st.isCompleted} 
                  onChange={() => {
                    if (!st.isCompleted) setActiveModalSubtask(i);
                    else toggleSubtask(activeProject.id, task.id, i);
                  }} 
                  style={{ cursor: (colId === 'progress' || st.isCompleted) ? 'pointer' : 'not-allowed', width: '18px', height: '18px', flexShrink: 0 }}
                />
              </div>
            ))}
            {colId !== 'done' && (
              <input type="text" className="add-sub-input" placeholder="+ Add subtask (Press Enter)..." onKeyDown={handleKeyDown} 
                     style={{ width: '100%', padding: '8px', marginTop: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}/>
            )}
          </div>
        )}
      </div>

      {activeModalSubtask !== null && (
        <CompleteSubtaskModal 
          onClose={() => setActiveModalSubtask(null)}
          onSubmit={(name, date) => {
            completeSubtask(activeProject.id, task.id, activeModalSubtask, name, date);
            setActiveModalSubtask(null);
          }}
        />
      )}
    </>
  );
};

export default TaskCard;