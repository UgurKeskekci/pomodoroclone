'use client';

import React, { useState, useEffect, useRef } from 'react';
import TimerControls from '../TimerControls/TimerControls';
import { useTimer } from '@/hooks/useTimer';
import { useTimerContext } from '@/context/TimerContext';
import './Timer.css';

// Basit konfeti SVG komponenti
const Confetti = () => {
  return (
    <div className="confetti-container">
      {[...Array(50)].map((_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
          transform: `scale(${0.5 + Math.random()})`,
          backgroundColor: ['#FF5A5F', '#4ECDC4', '#3F88C5', '#FFD93D'][Math.floor(Math.random() * 4)]
        }} />
      ))}
    </div>
  );
};

const Timer = ({ currentMode, setCurrentMode }) => {
  const canvasRef = useRef(null);
  const { timerConfig, setTimerEnded, activeTask } = useTimerContext();
  const { timeLeft, isRunning, startTimer, pauseTimer, resetTimer } = useTimer(currentMode);
  const [sessionCount, setSessionCount] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Zamanlayıcı bittiğinde yapılacak işlemler
  useEffect(() => {
    if (timeLeft === 0) {
      // Timer bittiğini bildir
      setTimerEnded(true);
      
      // Pomodoro tamamlandığında havai fişek göster
      if (currentMode === 'pomodoro') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // 3 saniye sonra kapat
      }
      
      // Sonraki moda geç
      if (currentMode === 'pomodoro') {
        // Pomodoro tamamlandı, mola zamanı
        setSessionCount(prev => prev + 1);
        
        // Her 4 pomodoro'dan sonra uzun mola, diğer durumlarda kısa mola
        if (sessionCount % 4 === 0) {
          setCurrentMode('longBreak');
        } else {
          setCurrentMode('shortBreak');
        }
      } else {
        // Mola bitti, pomodoro zamanına geri dön
        setCurrentMode('pomodoro');
      }
      
      // Zamanlayıcıyı sıfırla
      resetTimer();
    }
  }, [timeLeft, currentMode, sessionCount]);
  
  // Mod değiştiğinde zamanlayıcıyı sıfırla
  useEffect(() => {
    resetTimer();
  }, [currentMode]);
  
  // Canvas animasyonu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 300;
    const height = canvas.height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;
    
    // Animasyon fonksiyonu
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Zamanlayıcı çemberi çiz
      const totalSeconds = timerConfig[currentMode] * 60;
      const progress = timeLeft / totalSeconds;
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (2 * Math.PI * progress);
      
      // Arka plan çemberi
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 8;
      ctx.stroke();
      
      // İlerleme çemberi
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      
      // Mod'a göre renk değiştir
      let gradientColor;
      if (currentMode === 'pomodoro') {
        gradientColor = ctx.createLinearGradient(0, 0, width, height);
        gradientColor.addColorStop(0, 'rgba(255, 90, 95, 0.8)');
        gradientColor.addColorStop(1, 'rgba(255, 138, 143, 0.8)');
      } else if (currentMode === 'shortBreak') {
        gradientColor = ctx.createLinearGradient(0, 0, width, height);
        gradientColor.addColorStop(0, 'rgba(78, 205, 196, 0.8)');
        gradientColor.addColorStop(1, 'rgba(126, 234, 227, 0.8)');
      } else {
        gradientColor = ctx.createLinearGradient(0, 0, width, height);
        gradientColor.addColorStop(0, 'rgba(63, 136, 197, 0.8)');
        gradientColor.addColorStop(1, 'rgba(111, 170, 224, 0.8)');
      }
      
      ctx.strokeStyle = gradientColor;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Animasyonu devam ettir
      requestAnimationFrame(animate);
    };
    
    // Animasyonu başlat
    animate();
    
    return () => {
      // Temizlik işlemi
      cancelAnimationFrame(animate);
    };
  }, [timeLeft, currentMode, timerConfig]);
  
  // Zamanlayıcı formatı
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Mod değiştirme işlemi
  const handleModeChange = (mode) => {
    if (isRunning) {
      pauseTimer();
    }
    setCurrentMode(mode);
  };
  
  // Mod adını Türkçe olarak göster
  const getModeText = () => {
    switch (currentMode) {
      case 'pomodoro':
        return 'Odaklanma zamanı';
      case 'shortBreak':
        return 'Kısa mola zamanı';
      case 'longBreak':
        return 'Uzun mola zamanı';
      default:
        return '';
    }
  };
  
  return (
    <div className="timer-container glass">
      {showConfetti && <Confetti />}
      
      <div className="timer-header">
        <h3 className="session-number">#{sessionCount}</h3>
        <h2 className="active-task-title">
          {activeTask ? activeTask.text : 'Görev seçilmedi'}
        </h2>
      </div>
      
      <div className="timer-tabs">
        <button 
          className={`tab ${currentMode === 'pomodoro' ? 'active' : ''}`}
          onClick={() => handleModeChange('pomodoro')}
        >
          Pomodoro
        </button>
        <button 
          className={`tab ${currentMode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => handleModeChange('shortBreak')}
        >
          Kısa Mola
        </button>
        <button 
          className={`tab ${currentMode === 'longBreak' ? 'active' : ''}`}
          onClick={() => handleModeChange('longBreak')}
        >
          Uzun Mola
        </button>
      </div>
      
      <div className="timer-display">
        <canvas ref={canvasRef} className="timer-particles" width="300" height="300"></canvas>
        <h1 className="time">{formatTime()}</h1>
      </div>
      
      <TimerControls 
        isRunning={isRunning}
        onStart={startTimer}
        onPause={pauseTimer}
      />
      
      <div className="session-info">
        <p>{getModeText()}</p>
      </div>
    </div>
  );
};

export default Timer; 