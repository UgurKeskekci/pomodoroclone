'use client';

import React, { createContext, useContext, useState } from 'react';

const TimerContext = createContext();

export const useTimerContext = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [timerConfig, setTimerConfig] = useState({
    pomodoro: 25, // 25 dakika
    shortBreak: 5, // 5 dakika
    longBreak: 15 // 15 dakika
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  
  const resetTimerEnded = () => {
    setTimerEnded(false);
  };
  
  return (
    <TimerContext.Provider value={{ 
      timerConfig, 
      setTimerConfig, 
      isRunning, 
      setIsRunning,
      timerEnded,
      setTimerEnded,
      resetTimerEnded,
      activeTask,
      setActiveTask
    }}>
      {children}
    </TimerContext.Provider>
  );
}; 