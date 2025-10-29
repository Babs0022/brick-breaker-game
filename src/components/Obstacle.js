import React from 'react';

const Obstacle = ({ position, width, height }) => {
  const obstacleStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${width}px`,
    height: `${height}px`,
  };

  return <div className="obstacle" style={obstacleStyle}></div>;
};

export default Obstacle;
