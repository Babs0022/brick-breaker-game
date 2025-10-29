import React from 'react';

const HUD = ({ score, lives, level, timer, mode, onQuit, onPause }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor(time % 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <div className="hud">
      <div className="hud-left">
        <div className="hud-item">
          <span className="hud-label">Score:</span>
          <span className="hud-value">{score}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Lives:</span>
          <span className="hud-value">{lives}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Level:</span>
          <span className="hud-value">{level}</span>
        </div>
        {mode === 'SPEEDRUN' && (
          <div className="hud-item">
            <span className="hud-label">Time:</span>
            <span className="hud-value">{formatTime(timer)}</span>
          </div>
        )}
      </div>
      <div className="hud-right">
        <button className="pause-button" onClick={onPause}>Pause</button>
        <button className="quit-button" onClick={onQuit}>Quit</button>
      </div>
    </div>
  );
};

export default HUD;
