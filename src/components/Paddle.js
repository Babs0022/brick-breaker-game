import React from 'react';

const Paddle = ({ paddlePosition, paddleWidth, isGodMode }) => {
  const paddleClasses = `paddle ${isGodMode ? 'god-mode' : ''}`;

  return (
    <div
      className={paddleClasses}
      style={{
        left: `${paddlePosition.x}px`,
        width: `${paddleWidth}px`,
      }}
    ></div>
  );
};

export default Paddle;