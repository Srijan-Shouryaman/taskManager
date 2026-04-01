import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';

const AddProjectModal = ({ onClose }) => {
  const { addProject } = useContext(ProjectContext);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleAdd = () => {
    if (name) { 
      addProject(name, date); 
      onClose(); 
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      
      {/* Relying strictly on .modal class */}
      <div className="modal" style={{ opacity: 1, visibility: 'visible', transform: 'translate(-50%, -50%) scale(1)' }}>
        <button className="close-modal" onClick={onClose}>&times;</button>
        
        <h1>Add New Project</h1>
        
        {/* Relying on #project-input class */}
        <input 
          type="text" 
          id="project-input"
          placeholder="Enter project name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
          <div id="project-deadline-tag">Deadline: </div>
          {/* Relying on #project-deadline class */}
          <input 
            type="date" 
            id="project-deadline"
            value={date} 
            onChange={e => setDate(e.target.value)} 
          />
        </div>
        
        {/* Relying on #add-project-btn class */}
        <button id="add-project-btn" onClick={handleAdd}>
          Add Project
        </button>
      </div>
    </>
  );
};

export default AddProjectModal;