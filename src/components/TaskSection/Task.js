'use client';

import React, { useState } from 'react';
import './Task.css';

const Task = ({ task, isActive, onToggle, onDelete, onPomodoroChange, onSetActive }) => {
  const [showControls, setShowControls] = useState(false);
  
  const handlePomodoroDecrease = (e) => {
    e.stopPropagation();
    onPomodoroChange(task.pomodoros - 1);
  };
  
  const handlePomodoroIncrease = (e) => {
    e.stopPropagation();
    onPomodoroChange(task.pomodoros + 1);
  };
  
  return (
    <div 
      className={`task ${task.completed ? 'completed' : ''} ${isActive ? 'active' : ''}`}
      onClick={() => !task.completed && onSetActive()}
    >
      <div className="task-left">
        <input 
          type="checkbox" 
          checked={task.completed}
          onChange={onToggle}
          className="task-checkbox"
          onClick={(e) => e.stopPropagation()}
        />
        <span className="task-text">{task.text}</span>
        {isActive && !task.completed && (
          <span className="active-indicator">Aktif</span>
        )}
      </div>
      <div className="task-right">
        <div className="pomodoro-count">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="pomodoro-icon">
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
          </svg>
          <span className="pomodoro-progress">
            {task.completedPomodoros}/{task.pomodoros}
          </span>
          {showControls && !task.completed && (
            <div className="pomodoro-controls">
              <button 
                className="pomodoro-btn decrease" 
                onClick={handlePomodoroDecrease}
                disabled={task.pomodoros <= 1}
              >
                -
              </button>
              <button 
                className="pomodoro-btn increase" 
                onClick={handlePomodoroIncrease}
              >
                +
              </button>
            </div>
          )}
        </div>
        <div className="task-actions">
          <button 
            className="task-menu-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setShowControls(!showControls);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
          </button>
          <button 
            className="delete-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task; 