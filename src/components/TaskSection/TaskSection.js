'use client';

import React, { useState, useEffect } from 'react';
import Task from './Task';
import { useTimerContext } from '@/context/TimerContext';
import './TaskSection.css';

const TaskSection = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [totalPomodoros, setTotalPomodoros] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const { isRunning, timerEnded, resetTimerEnded, setActiveTask } = useTimerContext();
  
  // Timer bittiğinde aktif görevi güncelle
  useEffect(() => {
    if (timerEnded && tasks.length > 0) {
      updateTaskProgress();
      resetTimerEnded();
    }
  }, [timerEnded, tasks]);
  
  // Aktif görev değiştiğinde context'i güncelle
  useEffect(() => {
    if (tasks.length > 0 && activeTaskIndex >= 0 && activeTaskIndex < tasks.length) {
      setActiveTask(tasks[activeTaskIndex]);
    } else {
      setActiveTask(null);
    }
  }, [activeTaskIndex, tasks, setActiveTask]);
  
  // Görev ilerleme durumunu güncelle
  const updateTaskProgress = () => {
    // Sadece pomodoro modunda görev ilerlemesini güncelle
    const currentMode = document.querySelector('.app').getAttribute('data-mode');
    if (currentMode !== 'pomodoro') return;
    
    const updatedTasks = [...tasks];
    const currentTask = updatedTasks[activeTaskIndex];
    
    if (currentTask) {
      // Tamamlanan pomodoro sayısını artır
      currentTask.completedPomodoros += 1;
      setCompletedPomodoros(prev => prev + 1);
      
      // Eğer görev tamamlandıysa, bir sonraki göreve geç
      if (currentTask.completedPomodoros >= currentTask.pomodoros) {
        currentTask.completed = true;
        
        // Bir sonraki tamamlanmamış göreve geç
        const nextTaskIndex = updatedTasks.findIndex((task, index) => 
          index > activeTaskIndex && !task.completed
        );
        
        if (nextTaskIndex !== -1) {
          setActiveTaskIndex(nextTaskIndex);
        }
      }
      
      setTasks(updatedTasks);
    }
  };
  
  // Yeni görev ekle
  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTaskText,
        completed: false,
        pomodoros: 1,
        completedPomodoros: 0
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTaskText('');
      setShowAddTask(false);
      
      setTotalPomodoros(prev => prev + 1);
      
      if (tasks.length === 0) {
        setActiveTaskIndex(0);
      }
    }
  };
  
  // Görevi tamamla/tamamlanmadı olarak işaretle
  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    // Eğer aktif görev tamamlandıysa, bir sonraki tamamlanmamış göreve geç
    const activeTask = updatedTasks[activeTaskIndex];
    if (activeTask && activeTask.id === taskId && activeTask.completed) {
      const nextTaskIndex = updatedTasks.findIndex((task, index) => 
        index > activeTaskIndex && !task.completed
      );
      
      if (nextTaskIndex !== -1) {
        setActiveTaskIndex(nextTaskIndex);
      }
    }
  };
  
  // Görevi sil
  const deleteTask = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    const task = tasks[taskIndex];
    
    // Toplam ve tamamlanan pomodoro sayılarını güncelle
    setTotalPomodoros(prev => prev - task.pomodoros);
    setCompletedPomodoros(prev => prev - task.completedPomodoros);
    
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    // Eğer silinen görev aktif görevse, bir sonraki göreve geç
    if (taskIndex === activeTaskIndex) {
      if (updatedTasks.length > 0) {
        if (taskIndex < updatedTasks.length) {
          setActiveTaskIndex(taskIndex);
        } else {
          setActiveTaskIndex(updatedTasks.length - 1);
        }
      } else {
        setActiveTaskIndex(-1);
      }
    } else if (taskIndex < activeTaskIndex) {
      // Eğer silinen görev aktif görevden önceyse, aktif görev indeksini güncelle
      setActiveTaskIndex(prev => prev - 1);
    }
  };
  
  // Görevin pomodoro sayısını değiştir
  const changeTaskPomodoros = (taskId, newPomodoros) => {
    // Pomodoro sayısı en az 1 olmalı
    if (newPomodoros < 1) return;
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    const oldPomodoros = tasks[taskIndex].pomodoros;
    
    // Toplam pomodoro sayısını güncelle
    setTotalPomodoros(prev => prev - oldPomodoros + newPomodoros);
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, pomodoros: newPomodoros };
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };
  
  // Görevi aktif yap
  const setTaskActive = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1 && !tasks[taskIndex].completed) {
      setActiveTaskIndex(taskIndex);
    }
  };
  
  // Tahmini bitiş zamanını hesapla
  const calculateEstimatedTime = () => {
    const remainingPomodoros = totalPomodoros - completedPomodoros;
    if (remainingPomodoros <= 0) return "Tamamlandı";
    
    const now = new Date();
    const pomodoroMinutes = 25; // Gerçek pomodoro süresi
    const shortBreakMinutes = 5; // Gerçek mola süresi
    
    // Toplam gereken dakika (her 4 pomodoro'dan sonra uzun mola)
    let totalMinutes = 0;
    for (let i = 0; i < remainingPomodoros; i++) {
      totalMinutes += pomodoroMinutes;
      if (i < remainingPomodoros - 1) {
        if ((completedPomodoros + i + 1) % 4 === 0) {
          totalMinutes += 15; // Uzun mola
        } else {
          totalMinutes += shortBreakMinutes; // Kısa mola
        }
      }
    }
    
    // Bitiş zamanını hesapla
    const finishTime = new Date(now.getTime() + totalMinutes * 60000);
    const hours = finishTime.getHours();
    const minutes = finishTime.getMinutes();
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="task-section glass">
      <div className="task-header">
        <h2>Görevler</h2>
        <button className="menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          </svg>
        </button>
      </div>
      
      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              isActive={tasks.indexOf(task) === activeTaskIndex}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              onPomodoroChange={(newPomodoros) => changeTaskPomodoros(task.id, newPomodoros)}
              onSetActive={() => setTaskActive(task.id)}
            />
          ))
        ) : (
          <div className="no-tasks">
            <p>Henüz görev eklenmedi</p>
            <p className="no-tasks-hint">Görev ekleyerek Pomodoro tekniğini kullanmaya başlayın</p>
          </div>
        )}
      </div>
      
      {showAddTask ? (
        <div className="add-task-form">
          <textarea
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Görev ekleyin..."
            rows={3}
            autoFocus
          />
          <div className="form-buttons">
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowAddTask(false);
                setNewTaskText('');
              }}
            >
              İptal
            </button>
            <button 
              className="save-btn"
              onClick={addTask}
            >
              <span className="save-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
              </span>
              Kaydet
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="add-task-btn glass-btn"
          onClick={() => setShowAddTask(true)}
        >
          <span className="plus-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </span>
          Görev Ekle
        </button>
      )}
      
      {tasks.length > 0 && (
        <div className="task-summary">
          <div className="pomodoro-counter">
            <span>Pomos: </span>
            <strong>{completedPomodoros}/{totalPomodoros}</strong>
          </div>
          <div className="finish-time">
            <span>Finish At: </span>
            <strong>{calculateEstimatedTime()}</strong>
            <span className="time-hint">{totalPomodoros > completedPomodoros ? `(${totalPomodoros - completedPomodoros}p)` : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSection; 