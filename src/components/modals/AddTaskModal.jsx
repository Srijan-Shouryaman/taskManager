import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';

const AddTaskModal = ({ onClose }) => {
  const { activeProject, addTask } = useContext(ProjectContext);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSave = () => {
    if (title) { addTask(activeProject.id, title, desc); onClose(); }
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="task-modal modal" style={{opacity: 1, visibility: 'visible', transform: 'translate(-50%, -50%) scale(1)'}}>
        <button className="close-task-modal close-modal" onClick={onClose}>&times;</button>
        <h1>Add New Task</h1>
        <input type="text" id="task-title-input" placeholder="Enter task title" value={title} onChange={e => setTitle(e.target.value)} 
               style={{ width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '10px', fontSize: '16px' }} />
        <textarea id="task-desc-input" placeholder="Enter task description" rows="3" value={desc} onChange={e => setDesc(e.target.value)} 
                  style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '10px', fontFamily: 'inherit', fontSize: '15px', resize: 'none' }}></textarea>
        <button id="save-task-btn" onClick={handleSave} 
                style={{ width: '100%', padding: '14px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer' }}>
          Save Task
        </button>
      </div>
    </>
  );
};
export default AddTaskModal;