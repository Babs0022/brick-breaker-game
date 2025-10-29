import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import HelpModal from './components/HelpModal';
import ErrorBoundary from './components/ErrorBoundary';
import { startAudio } from './components/Sound';

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleSelectMode = (mode) => {
    startAudio();
    setGameMode(mode);
  };

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  const handleQuit = () => {
    setGameMode(null);
  };

  return (
    <div className="App">
      <div className="starfield"></div>
      {showHelp && <HelpModal onClose={handleCloseHelp} />}
      <ErrorBoundary>
        {gameMode ? (
          <Game mode={gameMode} onQuit={handleQuit} />
        ) : (
          <StartScreen onSelectMode={handleSelectMode} onShowHelp={handleShowHelp} />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
