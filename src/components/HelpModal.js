import React from 'react';

const HelpModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>How to Play</h2>
        <p>Break all the bricks to advance to the next level!</p>

        <h3>Controls</h3>
        <p>Move your mouse left and right to control the paddle.</p>

        <h3>Game Modes</h3>
        <ul>
          <li><strong>Endless:</strong> Play through an infinite number of increasingly difficult levels.</li>
          <li><strong>Marathon:</strong> Complete 5 challenging levels to win.</li>
          <li><strong>Speedrun:</strong> Try to complete all levels in the fastest time possible.</li>
        </ul>

        <h3>Power-Ups & Boosts</h3>
        <p>Certain bricks will drop power-ups when destroyed. Catch them with your paddle!</p>
        <ul>
          <li><span className="power-up-icon power-up-multiball"></span> <strong>Triple Ball (Multiball):</strong> Splits your ball into three.</li>
          <li><span className="power-up-icon power-up-enlarge"></span> <strong>Paddle Enlarge:</strong> Temporarily increases the width of your paddle.</li>
          <li><span className="power-up-icon power-up-slow"></span> <strong>Slow Motion:</strong> Slows down all balls on the screen.</li>
          <li><span className="power-up-icon power-up-explosive"></span> <strong>Explosive Ball:</strong> Makes your ball explosive for one hit, destroying bricks in a radius.</li>
          <li><span className="power-up-icon power-up-extralife"></span> <strong>Extra Life:</strong> Grants you an additional life.</li>
          <li><span className="power-up-icon god-mode"></span> <strong>God Mode:</strong> The paddle automatically follows the ball for 10 seconds. You can't lose!</li>
        </ul>

        <h3>Secrets</h3>
        <p>One brick in each level is a <strong>Secret Brick</strong>. It looks different from the others. Hit it to trigger a shower of power-ups!</p>
      </div>
    </div>
  );
};

export default HelpModal;
