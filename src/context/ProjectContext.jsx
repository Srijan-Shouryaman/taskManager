import React, { createContext, useState, useEffect, useRef } from 'react';
import { initialProjects } from '../data/initialData';
import { normalizeDeadlineNotBeforeToday } from '../utils/date';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  
  // 1. LAZY INITIALIZATION: Check local storage on first load
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('prism_app_projects');
      if (savedProjects) {
        return JSON.parse(savedProjects);
      }
    } catch (error) {
      console.error("Failed to parse local storage data:", error);
    }
    return initialProjects; 
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('prism_app_theme') || 'light';
  });

  // Hydration flag to prevent server-side rendering flashes
  const [isMounted, setIsMounted] = useState(false);

  const [currentView, setCurrentView] = useState('home');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeHistoryProjectId, setActiveHistoryProjectId] = useState(null); 
  const [notification, setNotification] = useState(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // --- REFS: To manage state safely inside intervals and track sessions ---
  const projectsRef = useRef(projects);
  const notificationTimerRef = useRef(null);
  const remindedThisSessionRef = useRef(new Set()); 

  // Keep our projectsRef updated with the latest data
  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('prism_app_theme', theme);
    }
  }, [theme, isMounted]);

  // AUTO-SAVE PROJECTS
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('prism_app_projects', JSON.stringify(projects));
    }
  }, [projects, isMounted]);

  // NOTIFICATION HANDLER
  const showNotification = (msg) => {
    setNotification(msg);
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
    notificationTimerRef.current = setTimeout(() => setNotification(null), 5000); 
  };

  // --- DEADLINE CHECKER ---
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentProjects = projectsRef.current;
      
      const projectsToRemind = currentProjects.filter(p => {
        if (!p.deadline || remindedThisSessionRef.current.has(p.id)) return false;
        
        const dueDate = new Date(p.deadline);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0;
      });

      if (projectsToRemind.length > 0) {
        const messages = projectsToRemind.map(p => {
          const dueDate = new Date(p.deadline);
          const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
          return `• <strong>${p.name}</strong> is due in ${diffDays} day(s)`;
        });
        
        const finalMsg = `⏰ <strong>Deadline Reminder!</strong><br/>${messages.join('<br/>')}`;
        showNotification(finalMsg);

        projectsToRemind.forEach(p => remindedThisSessionRef.current.add(p.id));
      }
    };


    if (isMounted) {
      checkDeadlines(); 
    }
  }, [isMounted]); 


  const addProject = (name, deadline) => {
    const safeDeadline = normalizeDeadlineNotBeforeToday(deadline);
    const newLog = { id: Date.now(), text: `Project created.`, date: new Date().toISOString() };
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

  // --- NEW: UPDATE DEADLINE ---
  const updateProjectDeadline = (projectId, newDeadline) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      
      const oldDeadline = p.deadline;
      const safeDeadline = normalizeDeadlineNotBeforeToday(newDeadline);
      
      const newLog = { 
        id: Date.now(), 
        text: `Project deadline updated from ${oldDeadline || 'None'} to ${safeDeadline}.`, 
        date: new Date().toISOString() 
      };

      // Remove from reminded list so the notification can fire again if the new date is soon
      remindedThisSessionRef.current.delete(p.id);

      return { 
        ...p, 
        deadline: safeDeadline, 
        reminded: false, 
        activityLog: [newLog, ...(p.activityLog || [])] 
      };
    }));
  };

  const addTask = (projectId, title, description) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newLog = { id: Date.now(), text: `Task "${title}" was added.`, date: new Date().toISOString() };
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

      const newLog = { id: Date.now(), text: `Subtask "${subtaskText}" completed by ${userName}.`, date: new Date().toISOString() };
      newP.activityLog = [newLog, ...(p.activityLog || [])];

      return newP;
    }));
  };

  const toggleSubtask = (projectId, taskId, subtaskIndex) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      
      let taskToMoveToProgress = null;
      let subtaskText = '';

      const updateList = (list, colName) => {
        let result = [];
        
        for (const t of list) {
          if (t.id === taskId) {
            const updatedSubtasks = t.subtasks.map((st, i) => {
              if (i === subtaskIndex) {
                subtaskText = st.text;
                return { ...st, isCompleted: !st.isCompleted }; 
              }
              return st;
            });

            const updatedTask = { ...t, subtasks: updatedSubtasks };

            if (colName === 'done' && !updatedSubtasks[subtaskIndex].isCompleted) {
              taskToMoveToProgress = updatedTask;
            } else {
              result.push(updatedTask);
            }
          } else {
            result.push(t);
          }
        }
        return result;
      };

      const newP = { 
        ...p, 
        planning: updateList(p.planning, 'planning'), 
        progress: updateList(p.progress, 'progress'), 
        done: updateList(p.done, 'done') 
      };

      if (taskToMoveToProgress) {
        newP.progress.push(taskToMoveToProgress);
      }

      if (subtaskText) {
        const newLog = { 
          id: Date.now(), 
          text: `Subtask "${subtaskText}" was marked incomplete.`, 
          date: new Date().toISOString() 
        };
        newP.activityLog = [newLog, ...(p.activityLog || [])];
      }

      return newP;
    }));
  };

  if (!isMounted) return null; 

  return (
    <ProjectContext.Provider value={{ 
      projects, activeProject, currentView, setCurrentView, setActiveProjectId, theme, setTheme, notification, 
      activeHistoryProjectId, setActiveHistoryProjectId, 
      addProject, updateProjectDeadline, addTask, moveTask, addSubtask, completeSubtask, toggleSubtask
    }}>
      {children}
    </ProjectContext.Provider>
  );
};