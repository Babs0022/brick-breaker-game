import React from 'react';

const StartScreen = ({ onSelectMode, onShowHelp }) => {
  return (
    <div className="start-screen">
      <h1>Brick Breaker</h1>
      <div className="modes">
        <button onClick={() => onSelectMode('ENDLESS')}>Endless</button>
        <button onClick={() => onSelectMode('MARATHON')}>Marathon</button>
        <button onClick={() => onSelectMode('SPEEDRUN')}>Speedrun</button>
      </div>
      <div className="help-button-container">
        <button onClick={onShowHelp}>How to Play</button>
      </div>
    </div>
  );
};

export default StartScreen;