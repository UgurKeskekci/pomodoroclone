'use client';

import React from 'react';
import './TimerControls.css';

const TimerControls = ({ isRunning, onStart, onPause }) => {
  return (
    <div className="timer-controls">
      <button 
        className="control-btn"
        onClick={isRunning ? onPause : onStart}
      >
        {isRunning ? (
          <>
            <span className="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
              </svg>
            </span>
            DURDUR
          </>
        ) : (
          <>
            <span className="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
              </svg>
            </span>
            BAŞLAT
          </>
        )}
      </button>
    </div>
  );
};

export default TimerControls; 