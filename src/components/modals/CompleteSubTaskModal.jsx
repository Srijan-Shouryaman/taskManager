import React, { useState } from 'react';

const CompleteSubtaskModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 

  const handleSubmit = () => {
    if (name.trim() !== '' && date !== '') {
      onSubmit(name, date);
    } else {
      alert("Please enter both your name and the date.");
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal" style={{ opacity: 1, visibility: 'visible', transform: 'translate(-50%, -50%) scale(1)' }}>
        <button className="close-modal" onClick={onClose}>&times;</button>
        
        <h1 style={{ textAlign: 'center', marginBottom: '28px', fontSize: '24px' }}>Complete Subtask</h1>
        
        <input 
          type="text" id="project-input" placeholder="Enter your name" 
          value={name} onChange={e => setName(e.target.value)} autoFocus
        />
        
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
          <div id="project-deadline-tag" style={{ marginRight: '10px', fontWeight: 'bold' }}>Date: </div>
          <input 
            type="date" id="project-deadline"
            value={date} onChange={e => setDate(e.target.value)} 
          />
        </div>
        
        <button id="add-project-btn" onClick={handleSubmit}>Mark as Done</button>
      </div>
    </>
  );
};

export default CompleteSubtaskModal;