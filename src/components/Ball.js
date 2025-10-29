import React from 'react';

const Ball = ({ ballPosition, isExplosive }) => {
  const ballClasses = `ball ${isExplosive ? 'explosive' : ''}`;

  return (
    <div
      className={ballClasses}
      style={{
        left: `${ballPosition.x}px`,
        top: `${ballPosition.y}px`,
      }}
    ></div>
  );
};

export default Ball;
