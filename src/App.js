import React, { useState } from 'react';
import Header from './components/Header/Header';
import Timer from './components/Timer/Timer';
import TaskSection from './components/TaskSection/TaskSection';
import { TimerProvider } from './context/TimerContext';
import './styles/global.css';

function App() {
  const [currentMode, setCurrentMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  
  return (
    <TimerProvider>
      <div className="app" data-mode={currentMode}>
        <div className="container">
          <Header />
          <Timer 
            currentMode={currentMode}
            setCurrentMode={setCurrentMode}
          />
          <TaskSection />
        </div>
      </div>
    </TimerProvider>
  );
}

export default App; 