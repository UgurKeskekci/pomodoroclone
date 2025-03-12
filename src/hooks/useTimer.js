'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimerContext } from '@/context/TimerContext';

export const useTimer = (mode) => {
  const { timerConfig, isRunning, setIsRunning, timerEnded, setTimerEnded } = useTimerContext();
  const [timeLeft, setTimeLeft] = useState(timerConfig[mode] * 60);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  
  useEffect(() => {
    // Ses dosyasını yükle
    audioRef.current = new Audio('/sounds/bell.mp3');
    
    return () => {
      // Temizlik işlemi
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Mod değiştiğinde süreyi güncelle
  useEffect(() => {
    setTimeLeft(timerConfig[mode] * 60);
  }, [mode, timerConfig]);
  
  // Zamanlayıcı işlemi
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Zamanlayıcı tamamlandı
            clearInterval(intervalRef.current);
            setIsRunning(false);
            
            // Ses çal
            if (audioRef.current) {
              audioRef.current.play().catch(err => console.log('Ses çalma hatası:', err));
            }
            
            // Timer bittiğini bildir
            setTimerEnded(true);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isRunning, setIsRunning, setTimerEnded]);
  
  // Zamanlayıcıyı başlat
  const startTimer = () => {
    setIsRunning(true);
  };
  
  // Zamanlayıcıyı durdur
  const pauseTimer = () => {
    setIsRunning(false);
  };
  
  // Zamanlayıcıyı sıfırla
  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(timerConfig[mode] * 60);
  };
  
  return {
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer
  };
}; 