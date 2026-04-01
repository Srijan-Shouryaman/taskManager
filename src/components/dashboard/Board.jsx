import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import Column from './Column';

const Board = ({ onAddTask }) => {
  const { activeProject } = useContext(ProjectContext);
  return (
    <div className="board">
      <Column title="Planning" colId="planning" tasks={activeProject.planning} onAddTask={onAddTask} />
      <Column title="In Progress" colId="progress" tasks={activeProject.progress} />
      <Column title="Done" colId="done" tasks={activeProject.done} />
    </div>
  );
};
export default Board;