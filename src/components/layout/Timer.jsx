import React, { useState, useEffect, useRef } from 'react';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro'); 
  const [isExpanded, setIsExpanded] = useState(false); 

  const timerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsExpanded(false); 
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsActive(false);
      
      if (Notification.permission === "granted") {
        new Notification("Time's up!", {
          body: mode === 'pomodoro' ? "Great job! Time for a break." : "Break is over. Back to work!",
        });
      } else {
        alert("Time's up!"); 
      }
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, mode]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'pomodoro') setTimeLeft(25 * 60);
    if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div ref={wrapperRef} className={`timer-widget ${isExpanded ? 'expanded' : ''}`}>
      
      {/* HEADER */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`timer-header ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
      >
        <div className="timer-header-left">
          <span>⏱️</span>
          <span className="timer-time-display">
            {formatTime(timeLeft)}
          </span>
        </div>
        <span className="timer-status-text">
          {isExpanded ? '▼' : '▲'} {mode === 'pomodoro' ? 'Focus' : 'Break'}
        </span>
      </div>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className="timer-content">
          
          <div className="timer-mode-toggles">
            <button 
              onClick={() => switchMode('pomodoro')}
              className={`timer-mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}
            >
              Pomodoro
            </button>
            <button 
              onClick={() => switchMode('shortBreak')}
              className={`timer-mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
            >
              Short Break
            </button>
          </div>

          <div className="timer-large-display">
            {formatTime(timeLeft)}
          </div>

          <div className="timer-actions">
            <button 
              onClick={toggleTimer}
              className={`timer-action-btn timer-start-btn ${isActive ? 'running' : ''}`}
            >
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={resetTimer}
              className="timer-action-btn timer-reset-btn"
            >
              Reset
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Timer;