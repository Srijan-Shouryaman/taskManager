import React, { useContext, useState } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import TaskCard from './TaskCard';

const Column = ({ title, colId, tasks, onAddTask }) => {
  const { moveTask } = useContext(ProjectContext);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData("taskId");
    if (id) moveTask(id, colId);
  };

  return (
    <div className="column" 
         style={{ border: isDragOver ? '2px dashed var(--accent)' : '2px solid transparent', transition: '0.2s' }}
         onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
         onDragLeave={() => setIsDragOver(false)}
         onDrop={handleDrop}>
      <div className="column-header">{title}</div>
      
      {/* UPDATED: Passing colId to the TaskCard */}
      {tasks.map(t => <TaskCard key={t.id} task={t} colId={colId} />)}
      
      {colId === 'planning' && (
        <div className="create-project" style={{height:'auto', padding:'15px'}} onClick={onAddTask}>
          <span style={{fontSize: '14px', fontWeight: '600'}}>+ Add Task</span>
        </div>
      )}
    </div>
  );
};
export default Column;