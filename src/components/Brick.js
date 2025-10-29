import React from 'react';

const Brick = ({ position, width, height, color, health, isSecret, scale }) => {
  const brickClasses = `brick ${isSecret ? 'secret' : ''}`;
  const brickStyle = {
    left: `${position.x * scale}px`,
    top: `${position.y * scale}px`,
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    backgroundColor: color,
    opacity: health * 0.35,
    boxShadow: `0 0 5px ${color}`,
    transition: 'opacity 0.2s ease-in-out',
  };

  return <div className={brickClasses} style={brickStyle}></div>;
};

export default Brick;