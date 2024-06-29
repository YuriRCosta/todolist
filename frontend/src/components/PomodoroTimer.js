import React, { useState, useEffect } from "react";
import "./PomodoroTimer.css";

const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [initialBreakMinutes, setInitialBreakMinutes] = useState(5);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            playAlarm();
            if (isBreak) {
              setIsBreak(false);
              setMinutes(initialMinutes);
              setSeconds(0);
            } else {
              setIsBreak(true);
              setMinutes(initialBreakMinutes);
              setSeconds(0);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [
    isActive,
    seconds,
    minutes,
    isBreak,
    initialMinutes,
    initialBreakMinutes,
  ]);

  const playAlarm = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1000, context.currentTime);
    gainNode.gain.setValueAtTime(1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 1);
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  };

  const handleMinutesChange = (e) => {
    const value = parseInt(e.target.value);
    setInitialMinutes(value);
    if (!isActive && !isBreak) {
      setMinutes(value);
    }
  };

  const handleBreakMinutesChange = (e) => {
    const value = parseInt(e.target.value);
    setInitialBreakMinutes(value);
    if (!isActive && isBreak) {
      setMinutes(value);
    }
  };

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-timer">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <div className="pomodoro-controls">
        <button onClick={handleStart}>Começar</button>
        <button onClick={handlePause}>Parar</button>
        <button onClick={handleReset}>Resetar</button>
      </div>
      <div className="pomodoro-settings">
        <div>
          <label>Duração do Pomodoro: </label>
          <input
            type="number"
            value={initialMinutes}
            onChange={handleMinutesChange}
            min="1"
          />
        </div>
        <div>
          <label>Duração da Pausa: </label>
          <input
            type="number"
            value={initialBreakMinutes}
            onChange={handleBreakMinutesChange}
            min="1"
          />
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
