import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { todayLocalYmd } from '../../utils/date';

const AddProjectModal = ({ onClose }) => {
  const { addProject } = useContext(ProjectContext);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const minDate = todayLocalYmd();

  const applyDeadline = (raw) => {
    if (raw == null || raw === '') {
      setDate('');
      return;
    }
    setDate(raw < minDate ? minDate : raw);
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    const deadline = date === '' ? '' : date < minDate ? minDate : date;
    addProject(name.trim(), deadline);
    onClose();
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div>

      <div className="modal" style={{ opacity: 1, visibility: 'visible', transform: 'translate(-50%, -50%) scale(1)' }}>
        <button className="close-modal" onClick={onClose}>&times;</button>

        <h1>Add New Project</h1>

        <input
          type="text"
          id="project-input"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="modal-deadline-row">
          <div id="project-deadline-tag">Deadline: </div>
          <input
            type="date"
            id="project-deadline"
            value={date}
            min={minDate}
            onChange={(e) => applyDeadline(e.target.value)}
            onBlur={(e) => applyDeadline(e.target.value)}
          />
        </div>

        <button id="add-project-btn" type="button" onClick={handleAdd}>
          Add Project
        </button>
      </div>
    </>
  );
};

export default AddProjectModal;
