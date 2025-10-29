import React from 'react';

const PauseMenu = ({ onResume, onRestart, onExit }) => {
  return (
    <div className="modal-overlay">
      <div className="pause-menu">
        <h2>Paused</h2>
        <button onClick={onResume}>Resume</button>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onExit}>Exit</button>
      </div>
    </div>
  );
};

export default PauseMenu;
