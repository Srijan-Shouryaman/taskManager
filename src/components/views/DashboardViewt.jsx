import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import Board from '../dashboard/Board';
import AddTaskModal from '../modals/AddTaskModal';

const DashboardView = () => {
  const { activeProject } = useContext(ProjectContext);
  const [showModal, setShowModal] = useState(false);
  if (!activeProject) return null;
  
  return (
    <div className="view-container active">
      <h1 className="hero-title">🎯 {activeProject.name} Tasks</h1>
      <p className="hero-sub">Sprint tracking and deployments.</p>
      <Board onAddTask={() => setShowModal(true)} />
      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
};
export default DashboardView;