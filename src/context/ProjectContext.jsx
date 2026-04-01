import React, { createContext, useState, useEffect } from 'react';
import { initialProjects } from '../data/initialData';
import { normalizeDeadlineNotBeforeToday } from '../utils/date';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [currentView, setCurrentView] = useState('home');
  const [activeProjectId, setActiveProjectId] = useState(null);
  
  // State for the History View
  const [activeHistoryProjectId, setActiveHistoryProjectId] = useState(null); 
  
  const [theme, setTheme] = useState('light');
  const [notification, setNotification] = useState(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000); 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setProjects(prevProjects => prevProjects.map(p => {
        if (!p.deadline || p.reminded) return p;
        const dueDate = new Date(p.deadline);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays <= 3 && diffDays >= 0) {
          showNotification(`⏰ <strong>Reminder:</strong> Project "${p.name}" is due in ${diffDays} day(s)!`);
          return { ...p, reminded: true };
        }
        return p;
      }));
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS WITH ACTIVITY LOGGING ---
  const addProject = (name, deadline) => {
    const safeDeadline = normalizeDeadlineNotBeforeToday(deadline);
    const newLog = { id: Date.now(), text: `Project created.`, date: new Date().toLocaleString() };
    setProjects((prev) => [
      ...prev,
      {
        id: `p${Date.now()}`,
        name,
        deadline: safeDeadline,
        reminded: false,
        planning: [],
        progress: [],
        done: [],
        activityLog: [newLog],
      },
    ]);
  };

  const addTask = (projectId, title, description) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newLog = { id: Date.now(), text: `Task "${title}" was added.`, date: new Date().toLocaleString() };
      return { 
        ...p, 
        planning: [...p.planning, { id: `t${Date.now()}`, title, description, subtasks: [] }],
        activityLog: [newLog, ...(p.activityLog || [])] 
      };
    }));
  };

  const moveTask = (taskId, targetCol) => {
    if (!activeProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      let taskObj = null;
      const updatedP = JSON.parse(JSON.stringify(p)); 
      
      ['planning', 'progress', 'done'].forEach(col => {
        const idx = updatedP[col].findIndex(t => t.id === taskId);
        if (idx > -1) taskObj = updatedP[col].splice(idx, 1)[0];
      });
      
      if (taskObj) {
        if (targetCol === 'done') taskObj.subtasks.forEach(st => st.isCompleted = true);
        updatedP[targetCol].push(taskObj);
      }
      return updatedP;
    }));
  };

  const addSubtask = (projectId, taskId, text) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updateList = (list) => list.map(t => t.id === taskId ? { ...t, subtasks: [...t.subtasks, { text, isCompleted: false, completedBy: '', completedDate: '' }] } : t);
      return { ...p, planning: updateList(p.planning), progress: updateList(p.progress), done: updateList(p.done) };
    }));
  };

  const completeSubtask = (projectId, taskId, subtaskIndex, userName, date) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      let taskToMoveToDone = null;
      let subtaskText = '';

      const updateList = (list, colName) => list.filter(t => {
        if (t.id !== taskId) return true;
        const newSubtasks = [...t.subtasks];
        
        newSubtasks[subtaskIndex].isCompleted = true;
        newSubtasks[subtaskIndex].completedBy = userName;
        newSubtasks[subtaskIndex].completedDate = date;
        subtaskText = newSubtasks[subtaskIndex].text; 
        
        t.subtasks = newSubtasks;

        const isAllDone = newSubtasks.length > 0 && newSubtasks.every(st => st.isCompleted);
        if (isAllDone && colName !== 'done') {
          taskToMoveToDone = t;
          return false; 
        }
        return true;
      });

      const newP = { 
        ...p, 
        planning: updateList(p.planning, 'planning'), 
        progress: updateList(p.progress, 'progress'), 
        done: updateList(p.done, 'done') 
      };

      if (taskToMoveToDone) newP.done.push(taskToMoveToDone);

      const newLog = { id: Date.now(), text: `Subtask "${subtaskText}" completed by ${userName}.`, date: new Date().toLocaleString() };
      newP.activityLog = [newLog, ...(p.activityLog || [])];

      return newP;
    }));
  };

  const toggleSubtask = (projectId, taskId, subtaskIndex) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      
      const updateList = (list) => list.map(t => {
        if (t.id !== taskId) return t;
        const newSubtasks = [...t.subtasks];
        newSubtasks[subtaskIndex].isCompleted = !newSubtasks[subtaskIndex].isCompleted;
        
        if (!newSubtasks[subtaskIndex].isCompleted) {
            newSubtasks[subtaskIndex].completedBy = '';
            newSubtasks[subtaskIndex].completedDate = '';
        }
        t.subtasks = newSubtasks;
        return t;
      });

      return { ...p, planning: updateList(p.planning), progress: updateList(p.progress), done: updateList(p.done) };
    }));
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, activeProject, currentView, setCurrentView, setActiveProjectId, theme, setTheme, notification, 
      activeHistoryProjectId, setActiveHistoryProjectId, 
      addProject, addTask, moveTask, addSubtask, completeSubtask, toggleSubtask
    }}>
      {children}
    </ProjectContext.Provider>
  );
};