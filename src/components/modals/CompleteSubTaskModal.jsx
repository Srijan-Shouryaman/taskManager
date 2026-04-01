import React, { useState, useMemo } from 'react';

const CompleteSubtaskModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  /** Fixed at open time — submit uses this, not user input. */
  const completionDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleSubmit = () => {
    if (name.trim() !== '') {
      onSubmit(name.trim(), completionDate);
    } else {
      alert('Please enter your name.');
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal" style={{ opacity: 1, visibility: 'visible', transform: 'translate(-50%, -50%) scale(1)' }}>
        <button className="close-modal" onClick={onClose}>&times;</button>

        <h1 style={{ textAlign: 'center', marginBottom: '28px', fontSize: '24px' }}>Complete Subtask</h1>

        <input
          type="text"
          id="project-input"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div className="modal-deadline-row">
          <div id="project-deadline-tag">Date: </div>
          <input
            type="date"
            id="project-deadline"
            value={completionDate}
            readOnly
            tabIndex={-1}
            aria-label="Completion date"
            onChange={() => {}}
            onKeyDown={(e) => e.preventDefault()}
            style={{ pointerEvents: 'none' }}
          />
        </div>

        <button id="add-project-btn" type="button" onClick={handleSubmit}>
          Mark as Done
        </button>
      </div>
    </>
  );
};

export default CompleteSubtaskModal;
